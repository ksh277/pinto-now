'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, RotateCw, Move, Square, Type, Download, ZoomIn, ZoomOut, Scissors, Loader2 } from 'lucide-react';

// 제품별 규격 정의 (mm 단위)
const PRODUCT_SPECS = {
  keyring: {
    width: 50,
    height: 50,
    safetyMargin: 10, // 1cm
    holePosition: { x: 25, y: 5 }, // 상단 중앙
    holeRadius: 2
  },
  stand: {
    width: 80,
    height: 100,
    safetyMargin: 10,
    holePosition: null,
    holeRadius: 0
  },
  coaster: {
    width: 90,
    height: 90,
    safetyMargin: 10,
    holePosition: null,
    holeRadius: 0
  }
};

// mm to px 변환 (300 DPI 기준: 1mm = 11.81px)
const MM_TO_PX = 11.81;
const PX_TO_MM = 1 / MM_TO_PX;

interface CanvasObject {
  id: string;
  type: 'image' | 'text' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  data: any;
}

interface GoodsEditorProps {
  productType: string;
}

export default function GoodsEditor({ productType }: GoodsEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'text' | 'shape'>('select');
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessingBg, setIsProcessingBg] = useState(false);

  const spec = PRODUCT_SPECS[productType as keyof typeof PRODUCT_SPECS] || PRODUCT_SPECS.keyring;
  const canvasWidth = spec.width * MM_TO_PX * zoom;
  const canvasHeight = spec.height * MM_TO_PX * zoom;

  // 캔버스 초기화 및 렌더링
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 배경 (흰색)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 안전영역 표시 (연한 회색)
    const safetyMarginPx = spec.safetyMargin * MM_TO_PX * zoom;
    ctx.strokeStyle = '#e5e5e5';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.strokeRect(safetyMarginPx, safetyMarginPx, 
                   canvas.width - safetyMarginPx * 2, 
                   canvas.height - safetyMarginPx * 2);

    // 컷라인 표시 (빨간색)
    ctx.strokeStyle = '#ef4444';
    ctx.setLineDash([]);
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // 홀 위치 표시 (키링의 경우)
    if (spec.holePosition) {
      const holeX = spec.holePosition.x * MM_TO_PX * zoom;
      const holeY = spec.holePosition.y * MM_TO_PX * zoom;
      const holeRadius = spec.holeRadius * MM_TO_PX * zoom;
      
      ctx.beginPath();
      ctx.arc(holeX, holeY, holeRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // 홀 영역 표시
      ctx.beginPath();
      ctx.arc(holeX, holeY, holeRadius + safetyMarginPx, 0, 2 * Math.PI);
      ctx.strokeStyle = '#fbbf24';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 객체들 렌더링
    objects.forEach(obj => {
      ctx.save();
      
      // 변형 적용
      ctx.translate(obj.x * zoom, obj.y * zoom);
      ctx.rotate(obj.rotation * Math.PI / 180);
      
      if (obj.type === 'image' && obj.data.imageElement) {
        ctx.drawImage(obj.data.imageElement, 0, 0, obj.width * zoom, obj.height * zoom);
      } else if (obj.type === 'text') {
        ctx.fillStyle = obj.data.color || '#000000';
        ctx.font = `${obj.data.fontSize * zoom}px ${obj.data.fontFamily || 'Arial'}`;
        ctx.fillText(obj.data.text, 0, 0);
      } else if (obj.type === 'shape') {
        ctx.fillStyle = obj.data.fill || '#000000';
        ctx.fillRect(0, 0, obj.width * zoom, obj.height * zoom);
      }
      
      // 선택된 객체 표시
      if (obj.id === selectedObjectId) {
        ctx.strokeStyle = '#3b82f6';
        ctx.setLineDash([]);
        ctx.lineWidth = 2;
        ctx.strokeRect(-2, -2, obj.width * zoom + 4, obj.height * zoom + 4);
        
        // 회전 핸들
        ctx.beginPath();
        ctx.arc(obj.width * zoom / 2, -20, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
      }
      
      ctx.restore();
    });
  }, [objects, selectedObjectId, spec, zoom]);

  // 캔버스 렌더링
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // 이미지 업로드 처리
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 1cm 여백을 고려한 최대 크기 계산
        const maxWidth = (spec.width - spec.safetyMargin * 2) * MM_TO_PX;
        const maxHeight = (spec.height - spec.safetyMargin * 2) * MM_TO_PX;
        
        // 비율 유지하면서 contain 스케일링
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        
        // 중앙 배치
        const x = (spec.width * MM_TO_PX - scaledWidth) / 2;
        const y = (spec.height * MM_TO_PX - scaledHeight) / 2;

        const newObject: CanvasObject = {
          id: `img_${Date.now()}`,
          type: 'image',
          x: x,
          y: y,
          width: scaledWidth,
          height: scaledHeight,
          rotation: 0,
          data: { imageElement: img, src: e.target?.result }
        };

        setObjects(prev => [...prev, newObject]);
        setSelectedObjectId(newObject.id);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // 텍스트 추가
  const addText = () => {
    const newObject: CanvasObject = {
      id: `text_${Date.now()}`,
      type: 'text',
      x: spec.width * MM_TO_PX / 2,
      y: spec.height * MM_TO_PX / 2,
      width: 100,
      height: 30,
      rotation: 0,
      data: { 
        text: '텍스트 입력', 
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Arial'
      }
    };

    setObjects(prev => [...prev, newObject]);
    setSelectedObjectId(newObject.id);
  };

  // 도형 추가
  const addShape = () => {
    const newObject: CanvasObject = {
      id: `shape_${Date.now()}`,
      type: 'shape',
      x: spec.width * MM_TO_PX / 2 - 25,
      y: spec.height * MM_TO_PX / 2 - 25,
      width: 50,
      height: 50,
      rotation: 0,
      data: { fill: '#3b82f6' }
    };

    setObjects(prev => [...prev, newObject]);
    setSelectedObjectId(newObject.id);
  };

  // 마우스 이벤트 처리
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    // 객체 선택 확인
    let selectedObj: CanvasObject | null = null;
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      if (x >= obj.x && x <= obj.x + obj.width && 
          y >= obj.y && y <= obj.y + obj.height) {
        selectedObj = obj;
        break;
      }
    }

    if (selectedObj) {
      setSelectedObjectId(selectedObj.id);
      setIsDragging(true);
      setDragStart({ x: x - selectedObj.x, y: y - selectedObj.y });
    } else {
      setSelectedObjectId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedObjectId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    setObjects(prev => prev.map(obj => {
      if (obj.id === selectedObjectId) {
        let newX = x - dragStart.x;
        let newY = y - dragStart.y;

        // 캔버스 경계 제한
        newX = Math.max(0, Math.min(newX, spec.width * MM_TO_PX - obj.width));
        newY = Math.max(0, Math.min(newY, spec.height * MM_TO_PX - obj.height));

        return { ...obj, x: newX, y: newY };
      }
      return obj;
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 선택된 객체 회전
  const rotateSelected = () => {
    if (!selectedObjectId) return;
    setObjects(prev => prev.map(obj => 
      obj.id === selectedObjectId 
        ? { ...obj, rotation: (obj.rotation + 15) % 360 }
        : obj
    ));
  };

  // 선택된 객체 삭제
  const deleteSelected = () => {
    if (!selectedObjectId) return;
    setObjects(prev => prev.filter(obj => obj.id !== selectedObjectId));
    setSelectedObjectId(null);
  };

  // 배경 제거 기능
  const removeBackground = async () => {
    const selectedObj = objects.find(obj => obj.id === selectedObjectId);
    if (!selectedObj || selectedObj.type !== 'image') return;

    setIsProcessingBg(true);

    try {
      // 이미지를 Blob으로 변환
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx || !selectedObj.data.imageElement) return;

      canvas.width = selectedObj.data.imageElement.width;
      canvas.height = selectedObj.data.imageElement.height;
      ctx.drawImage(selectedObj.data.imageElement, 0, 0);
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append('image', blob, 'image.jpg');

        try {
          const response = await fetch('/api/remove-bg', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            if (errorData.useClientSide) {
              // 클라이언트 사이드에서 간단한 배경제거 시뮬레이션
              await simulateBackgroundRemoval(selectedObj);
            } else {
              throw new Error('배경 제거에 실패했습니다.');
            }
            return;
          }

          const resultBlob = await response.blob();
          const resultUrl = URL.createObjectURL(resultBlob);
          
          const newImg = new Image();
          newImg.onload = () => {
            setObjects(prev => prev.map(obj => 
              obj.id === selectedObjectId
                ? { 
                    ...obj, 
                    data: { 
                      ...obj.data, 
                      imageElement: newImg, 
                      src: resultUrl 
                    }
                  }
                : obj
            ));
          };
          newImg.src = resultUrl;

        } catch (error) {
          console.error('Background removal error:', error);
          // 폴백: 클라이언트 사이드 시뮬레이션
          await simulateBackgroundRemoval(selectedObj);
        }
      }, 'image/jpeg', 0.8);

    } catch (error) {
      console.error('Background removal error:', error);
    } finally {
      setIsProcessingBg(false);
    }
  };

  // 배경제거 시뮬레이션 (API가 없을 때)
  const simulateBackgroundRemoval = async (selectedObj: CanvasObject) => {
    // 간단한 배경제거 시뮬레이션 (실제로는 투명도만 적용)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !selectedObj.data.imageElement) return;

    canvas.width = selectedObj.data.imageElement.width;
    canvas.height = selectedObj.data.imageElement.height;
    
    // 원본 이미지 그리기
    ctx.drawImage(selectedObj.data.imageElement, 0, 0);
    
    // 간단한 엣지 검출로 배경제거 효과 시뮬레이션
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // 모서리 픽셀들을 투명하게 만들기 (간단한 배경제거 효과)
    const threshold = 50;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // 흰색 배경과 유사한 픽셀들을 투명하게
      if (r > 200 && g > 200 && b > 200) {
        data[i + 3] = Math.max(0, data[i + 3] - 100); // 투명도 증가
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const resultUrl = canvas.toDataURL('image/png');
    const newImg = new Image();
    newImg.onload = () => {
      setObjects(prev => prev.map(obj => 
        obj.id === selectedObjectId
          ? { 
              ...obj, 
              data: { 
                ...obj.data, 
                imageElement: newImg, 
                src: resultUrl 
              }
            }
          : obj
      ));
    };
    newImg.src = resultUrl;
  };

  // 줌 조절
  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* 좌측 도구 패널 */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-4">
        <h2 className="text-lg font-semibold">{productType} 편집기</h2>
        
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            크기: {spec.width}mm × {spec.height}mm
          </div>
          <div className="text-sm text-gray-600">
            안전영역: {spec.safetyMargin}mm
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            variant={tool === 'select' ? 'default' : 'outline'}
            size="sm" 
            className="w-full justify-start"
            onClick={() => setTool('select')}
          >
            <Move className="w-4 h-4 mr-2" />
            선택/이동
          </Button>

          <label className="block">
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                이미지 업로드
              </span>
            </Button>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={addText}
          >
            <Type className="w-4 h-4 mr-2" />
            텍스트 추가
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={addShape}
          >
            <Square className="w-4 h-4 mr-2" />
            도형 추가
          </Button>
        </div>

        {selectedObjectId && (
          <Card>
            <CardContent className="p-3 space-y-2">
              <div className="text-sm font-medium">선택된 객체</div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={rotateSelected}>
                  <RotateCw className="w-4 h-4" />
                </Button>
                {objects.find(obj => obj.id === selectedObjectId)?.type === 'image' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={removeBackground}
                    disabled={isProcessingBg}
                  >
                    {isProcessingBg ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Scissors className="w-4 h-4" />
                    )}
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={deleteSelected}>
                  삭제
                </Button>
              </div>
              {objects.find(obj => obj.id === selectedObjectId)?.type === 'image' && (
                <div className="text-xs text-gray-500">
                  <Scissors className="w-3 h-3 inline mr-1" />
                  배경제거
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Button size="sm" variant="outline" onClick={() => handleZoom(-0.1)}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm">{Math.round(zoom * 100)}%</span>
            <Button size="sm" variant="outline" onClick={() => handleZoom(0.1)}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          
          <Button className="w-full">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>
        </div>
      </div>

      {/* 메인 캔버스 영역 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="border border-gray-300 cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>
    </div>
  );
}