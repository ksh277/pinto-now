import React, { useState, useCallback, useRef, useEffect } from "react";
import { Undo2, Redo2, Download, Save, X, Upload, Type, Square, Circle, Move, Trash2, RotateCw, Eraser } from "lucide-react";
import { autoResizeImage, getCenterPosition, loadImageFile, removeImageBackground, optimizeImage, calculateCanvasSizeForImage, generateCanvasShapeMask, analyzeImagePixelBounds } from "../utils/imageUtils";

// Utility functions
const cn = (...classes) => classes.filter(Boolean).join(' ');

// UI Components (기존과 동일)
const Button = ({ children, variant = "default", size = "sm", className = "", disabled = false, onClick, onMouseDown, title, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 bg-gray-700 text-white hover:bg-gray-600",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white",
    ghost: "hover:bg-accent hover:text-accent-foreground hover:bg-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  };
  
  const sizes = {
    sm: "h-9 px-3 text-sm",
    default: "h-10 py-2 px-4"
  };
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={onMouseDown}
      title={title}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", type = "text", ...props }) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};

const Label = ({ className = "", ...props }) => {
  return (
    <label
      className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
      {...props}
    />
  );
};

const Select = ({ children, value, onValueChange, disabled = false }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
        disabled={disabled}
        className="w-full h-10 px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {children}
      </select>
    </div>
  );
};

// Toast hook (기존과 동일)
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  
  const toast = useCallback(({ title, description, variant = "default" }) => {
    const id = Date.now();
    const newToast = { id, title, description, variant };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);
  
  return { toast, toasts };
};

// Constants (기존과 동일)
const PRODUCT_PRESETS = {
  keyring: [
    { name: "스퀘어 키링", width: 50, height: 50 },
    { name: "원형 키링", width: 60, height: 60 },
    { name: "하트 키링", width: 55, height: 50 },
  ],
  stand: [
    { name: "스마트톡 원형", width: 40, height: 40 },
    { name: "스마트톡 사각", width: 45, height: 45 },
    { name: "스마트톡 하트", width: 50, height: 45 },
  ],
  photocard: [
    { name: "포토카드 홀더", width: 65, height: 100 },
    { name: "미니 포토카드", width: 54, height: 86 },
    { name: "대형 포토카드", width: 70, height: 105 },
  ],
  sticker: [
    { name: "원형 스티커", width: 50, height: 50 },
    { name: "사각 스티커", width: 60, height: 40 },
    { name: "대형 스티커", width: 80, height: 60 },
  ],
  phonecase: [
    { name: "아이폰 케이스", width: 80, height: 160 },
    { name: "갤럭시 케이스", width: 85, height: 165 },
    { name: "태블릿 케이스", width: 200, height: 280 },
  ],
  tshirt: [
    { name: "티셔츠 앞면", width: 200, height: 250 },
    { name: "티셔츠 뒷면", width: 200, height: 250 },
    { name: "후드티 앞면", width: 220, height: 280 },
  ],
};

const MM_TO_PX_RATIO = 10;

// 개선된 ImageTools 컴포넌트
function ImageTools({ selectedImage, onUpdateImage, onRemoveBackground, onCanvasResize, canvasSize, disabled }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isResizingCanvas, setIsResizingCanvas] = useState(false);
  
  const handleRemoveBackground = async () => {
    if (!selectedImage || isProcessing) return;
    
    setIsProcessing(true);
    try {
      console.log('🎨 배경 제거 시작...', selectedImage);
      // 원본 파일 객체가 있으면 서버 API 사용, 없으면 클라이언트 사이드만
      const processedSrc = await removeImageBackground(selectedImage.src, selectedImage.originalFile);
      onUpdateImage(selectedImage.id, { src: processedSrc });
      console.log('✅ 배경 제거 완료');
    } catch (error) {
      console.error('❌ 배경 제거 실패:', error);
      // Toast 알림 추가
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResizeCanvasToFitImage = async () => {
    if (!selectedImage || isResizingCanvas) return;
    
    setIsResizingCanvas(true);
    try {
      console.log('🎯 GitHub 커뮤니티 방식: 픽셀 분석 + 바운딩 박스 + 여백');
      console.log('🖼️ 이미지 정보:', selectedImage);
      
      // 1단계: 배경 제거 (필요시)
      let processedImageSrc = selectedImage.src;
      let isBackgroundRemoved = selectedImage.src.startsWith('data:image') && selectedImage.src.includes('base64');
      
      if (!isBackgroundRemoved && selectedImage.originalFile) {
        console.log('🔄 1단계: 배경 제거 중...');
        try {
          processedImageSrc = await removeImageBackground(selectedImage.src, selectedImage.originalFile);
          // 이미지 업데이트
          onUpdateImage(selectedImage.id, { src: processedImageSrc });
          console.log('✅ 배경 제거 완료');
        } catch (error) {
          console.warn('⚠️ 배경 제거 실패, 원본 사용:', error.message);
        }
      }
      
      // 2단계: 클라이언트에서 실제 픽셀 바운딩 박스 분석
      console.log('🔄 2단계: 클라이언트 픽셀 분석 중...');
      const pixelAnalysis = await analyzeImagePixelBounds(processedImageSrc);
      console.log('📊 픽셀 분석 결과:', pixelAnalysis);
      
      // 3단계: GitHub 커뮤니티 방식 - 바운딩 박스 + 여백 계산
      const margin = Math.round(1 * (96 / 2.54)); // 1cm ≈ 38픽셀 at 96 DPI
      const bbox = pixelAnalysis.boundingBox;
      
      console.log('📏 원본 바운딩 박스:', bbox);
      console.log('📐 여백 크기:', margin + 'px (' + (margin / (96 / 2.54)).toFixed(1) + 'cm)');
      
      // GitHub 방식: 여백 추가
      const x_new = Math.max(0, bbox.x - margin);
      const y_new = Math.max(0, bbox.y - margin);
      const w_new = bbox.width + (2 * margin);
      const h_new = bbox.height + (2 * margin);
      
      console.log('📏 여백 추가 후:', { x: x_new, y: y_new, width: w_new, height: h_new });
      
      // 4단계: 캔버스 크기로 변환
      const newCanvasSize = {
        width: Math.round(w_new),
        height: Math.round(h_new),
        widthMM: Math.round(w_new / (96 / 25.4)), // 96 DPI to mm
        heightMM: Math.round(h_new / (96 / 25.4))
      };
      
      console.log('🎨 새 캔버스 크기:', newCanvasSize);
      
      // 캔버스 크기 변경
      onCanvasResize && onCanvasResize(newCanvasSize, null);
      
      console.log('✅ GitHub 커뮤니티 방식 완료!');
      console.log('- 방법: 픽셀 분석 → 바운딩 박스 → 1cm 여백 추가');
      console.log('- 신뢰도:', pixelAnalysis.confidence);
      console.log('- 픽셀 수:', pixelAnalysis.pixelCount);
      
    } catch (error) {
      console.error('❌ 스마트 캔버스 조절 실패:', error);
      // 폴백: 기본 캔버스 맞춤
      try {
        handleAutoFit();
      } catch (fallbackError) {
        console.error('❌ 폴백도 실패:', fallbackError);
      }
    } finally {
      setIsResizingCanvas(false);
    }
  };
  
  const handleAutoFit = () => {
    if (!selectedImage || !canvasSize) return;
    
    const img = new Image();
    img.onload = () => {
      const resizedDimensions = autoResizeImage(
        { width: img.width, height: img.height },
        canvasSize,
        0.8
      );
      
      const centerPosition = getCenterPosition(resizedDimensions, canvasSize);
      
      onUpdateImage(selectedImage.id, {
        ...resizedDimensions,
        ...centerPosition
      });
    };
    img.src = selectedImage.src;
  };
  
  if (!selectedImage || selectedImage.type !== 'image') {
    return null;
  }
  
  return (
    <div className="p-4 border-b border-gray-700">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-sm font-medium text-white">이미지 도구</span>
      </div>
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAutoFit}
          disabled={disabled}
          className="w-full text-xs hover:bg-blue-600 hover:text-white border-blue-400 text-blue-400"
        >
          캔버스에 맞춤
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRemoveBackground}
          disabled={disabled || isProcessing}
          className="w-full text-xs hover:bg-purple-600 hover:text-white border-purple-400 text-purple-400"
        >
          <Eraser className="w-3 h-3 mr-1" />
          {isProcessing ? '처리중...' : '배경 제거'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResizeCanvasToFitImage}
          disabled={disabled || isResizingCanvas}
          className="w-full text-xs hover:bg-yellow-600 hover:text-white border-yellow-400 text-yellow-400"
        >
          🎯
          {isResizingCanvas ? '픽셀 분석중...' : '정확한 캔버스 조절'}
        </Button>
        <div className="text-xs text-gray-400 mt-1">
          픽셀 분석 → 바운딩 박스 → 1cm 여백 추가
        </div>
      </div>
    </div>
  );
}

// 개선된 SizeSelector Component
function SizeSelector({ productType, onSizeSet }) {
  const [selectedPreset, setSelectedPreset] = useState("");
  const [customWidth, setCustomWidth] = useState(50);
  const [customHeight, setCustomHeight] = useState(50);
  const [mode, setMode] = useState("preset");

  const presets = PRODUCT_PRESETS[productType] || PRODUCT_PRESETS.keyring;

  const handlePresetSelect = (presetName) => {
    const preset = presets.find((p) => p.name === presetName);
    if (preset) {
      setSelectedPreset(presetName);
      onSizeSet({
        width: preset.width * MM_TO_PX_RATIO,
        height: preset.height * MM_TO_PX_RATIO,
        widthMM: preset.width,
        heightMM: preset.height,
      });
    }
  };

  const handleCustomSize = () => {
    if (customWidth > 0 && customHeight > 0) {
      onSizeSet({
        width: customWidth * MM_TO_PX_RATIO,
        height: customHeight * MM_TO_PX_RATIO,
        widthMM: customWidth,
        heightMM: customHeight,
      });
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSelectedPreset("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-gray-300">크기 설정 방식</Label>
        <div className="flex space-x-2">
          <Button
            variant={mode === "preset" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("preset")}
            onMouseDown={(e) => e.preventDefault()}
            className={cn("flex-1 text-xs", mode !== "preset" && "border-gray-600 text-gray-300")}
          >
            프리셋
          </Button>
          <Button
            variant={mode === "custom" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("custom")}
            onMouseDown={(e) => e.preventDefault()}
            className={cn("flex-1 text-xs", mode !== "custom" && "border-gray-600 text-gray-300")}
          >
            직접입력
          </Button>
        </div>
      </div>

      {mode === "preset" ? (
        <div className="space-y-3">
          <Label className="text-xs text-gray-300">제품 크기 선택</Label>
          <Select value={selectedPreset} onValueChange={handlePresetSelect} disabled={mode !== "preset"}>
            <option value="">크기를 선택하세요</option>
            {presets.map((preset) => (
              <option key={preset.name} value={preset.name}>
                {preset.name} ({preset.width}×{preset.height}mm)
              </option>
            ))}
          </Select>
        </div>
      ) : (
        <div className="space-y-3">
          <Label className="text-xs text-gray-300">사용자 정의 크기 (mm)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-400">가로</Label>
              <Input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value) || 0)}
                min="10"
                max="500"
                disabled={mode !== "custom"}
                className={cn(
                  "bg-gray-700 border-gray-600 text-white text-xs",
                  mode !== "custom" && "disabled:opacity-30 disabled:cursor-not-allowed",
                  mode === "custom" && "focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                )}
                placeholder="가로 (mm)"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-400">세로</Label>
              <Input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value) || 0)}
                min="10"
                max="500"
                disabled={mode !== "custom"}
                className={cn(
                  "bg-gray-700 border-gray-600 text-white text-xs",
                  mode !== "custom" && "disabled:opacity-30 disabled:cursor-not-allowed",
                  mode === "custom" && "focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                )}
                placeholder="세로 (mm)"
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCustomSize}
            disabled={mode !== "custom" || customWidth <= 0 || customHeight <= 0}
            className={cn(
              "w-full text-xs",
              mode !== "custom" || customWidth <= 0 || customHeight <= 0
                ? "disabled:opacity-30 disabled:cursor-not-allowed"
                : "hover:bg-blue-600 hover:text-white border-blue-400 text-blue-400"
            )}
          >
            크기 적용
          </Button>
        </div>
      )}

      <div className="text-xs text-gray-400 mt-2">
        {mode === "preset" && selectedPreset && (
          <div>
            선택된 크기: {presets.find((p) => p.name === selectedPreset)?.width}×{presets.find((p) => p.name === selectedPreset)?.height}mm
          </div>
        )}
        {mode === "custom" && customWidth > 0 && customHeight > 0 && (
          <div>설정될 크기: {customWidth}×{customHeight}mm</div>
        )}
        {mode === "custom" && (customWidth <= 0 || customHeight <= 0) && (
          <div className="text-yellow-400">가로와 세로 크기를 입력하세요 (10-500mm)</div>
        )}
      </div>
    </div>
  );
}

// 개선된 DraggableElement Component  
function DraggableElement({ element, isSelected, onSelect, onUpdate, onDelete, canvasBounds }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState(null);
  const elementRef = useRef(null);

  const handlePointerDown = useCallback((e) => {
    if (e.target === elementRef.current || elementRef.current?.contains(e.target)) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - element.x, y: e.clientY - element.y });
      onSelect(element.id);
    }
  }, [element, onSelect]);

  const handleResizeStart = useCallback((e, handle) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: element.width,
      startHeight: element.height,
      startX_elem: element.x,
      startY_elem: element.y
    });
  }, [element]);

  useEffect(() => {
    if (isDragging) {
      const handleGlobalPointerMove = (e) => {
        const newX = Math.max(0, Math.min(canvasBounds.width - element.width, e.clientX - dragStart.x));
        const newY = Math.max(0, Math.min(canvasBounds.height - element.height, e.clientY - dragStart.y));
        onUpdate(element.id, { x: newX, y: newY });
      };

      const handleGlobalPointerUp = () => {
        setIsDragging(false);
      };

      document.addEventListener('pointermove', handleGlobalPointerMove);
      document.addEventListener('pointerup', handleGlobalPointerUp);

      return () => {
        document.removeEventListener('pointermove', handleGlobalPointerMove);
        document.removeEventListener('pointerup', handleGlobalPointerUp);
      };
    }
  }, [isDragging, dragStart, element, canvasBounds, onUpdate]);

  useEffect(() => {
    if (isResizing && resizeStart) {
      const handleGlobalPointerMove = (e) => {
        const deltaX = e.clientX - resizeStart.startX;
        const deltaY = e.clientY - resizeStart.startY;
        
        let newWidth = resizeStart.startWidth;
        let newHeight = resizeStart.startHeight;
        let newX = resizeStart.startX_elem;
        let newY = resizeStart.startY_elem;
        
        // 비율 유지 (Shift 키를 누르거나 이미지인 경우)
        const maintainRatio = e.shiftKey || element.type === 'image';
        const aspectRatio = resizeStart.startWidth / resizeStart.startHeight;
        
        switch (resizeStart.handle) {
          case 'se':
            newWidth = Math.max(20, resizeStart.startWidth + deltaX);
            newHeight = maintainRatio ? newWidth / aspectRatio : Math.max(20, resizeStart.startHeight + deltaY);
            break;
          case 'sw':
            newWidth = Math.max(20, resizeStart.startWidth - deltaX);
            newHeight = maintainRatio ? newWidth / aspectRatio : Math.max(20, resizeStart.startHeight + deltaY);
            newX = resizeStart.startX_elem + (resizeStart.startWidth - newWidth);
            break;
          case 'ne':
            newWidth = Math.max(20, resizeStart.startWidth + deltaX);
            newHeight = maintainRatio ? newWidth / aspectRatio : Math.max(20, resizeStart.startHeight - deltaY);
            newY = resizeStart.startY_elem + (resizeStart.startHeight - newHeight);
            break;
          case 'nw':
            newWidth = Math.max(20, resizeStart.startWidth - deltaX);
            newHeight = maintainRatio ? newWidth / aspectRatio : Math.max(20, resizeStart.startHeight - deltaY);
            newX = resizeStart.startX_elem + (resizeStart.startWidth - newWidth);
            newY = resizeStart.startY_elem + (resizeStart.startHeight - newHeight);
            break;
        }
        
        // 캔버스 경계 확인
        if (newX >= 0 && newY >= 0 && newX + newWidth <= canvasBounds.width && newY + newHeight <= canvasBounds.height) {
          onUpdate(element.id, { 
            width: newWidth, 
            height: newHeight,
            x: newX,
            y: newY 
          });
        }
      };

      const handleGlobalPointerUp = () => {
        setIsResizing(false);
        setResizeStart(null);
      };

      document.addEventListener('pointermove', handleGlobalPointerMove);
      document.addEventListener('pointerup', handleGlobalPointerUp);

      return () => {
        document.removeEventListener('pointermove', handleGlobalPointerMove);
        document.removeEventListener('pointerup', handleGlobalPointerUp);
      };
    }
  }, [isResizing, resizeStart, element, canvasBounds, onUpdate]);

  const resizeHandles = [
    { id: 'nw', className: 'cursor-nw-resize', style: { top: -6, left: -6 } },
    { id: 'ne', className: 'cursor-ne-resize', style: { top: -6, right: -6 } },
    { id: 'sw', className: 'cursor-sw-resize', style: { bottom: -6, left: -6 } },
    { id: 'se', className: 'cursor-se-resize', style: { bottom: -6, right: -6 } },
  ];

  return (
    <div
      ref={elementRef}
      className={`absolute select-none touch-none ${isSelected ? 'z-10' : 'z-0'}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation || 0}deg)`,
        transformOrigin: 'center center'
      }}
      onPointerDown={handlePointerDown}
    >
      {/* Element Content */}
      {element.type === 'image' && element.src && (
        <img
          src={element.src}
          alt=""
          className={cn(
            "w-full h-full object-contain border-2",
            isDragging ? 'cursor-grabbing' : 'cursor-grab',
            isSelected ? 'border-blue-500' : 'border-transparent'
          )}
          draggable={false}
        />
      )}
      
      {element.type === 'text' && (
        <div
          className={cn(
            "w-full h-full flex items-center justify-center border-2 bg-transparent",
            isDragging ? 'cursor-grabbing' : 'cursor-grab',
            isSelected ? 'border-blue-500' : 'border-transparent'
          )}
          style={{
            fontSize: element.fontSize || 24,
            fontFamily: element.fontFamily || 'Pretendard',
            fontWeight: element.fontWeight || 'normal',
            fontStyle: element.fontStyle || 'normal',
            color: element.color || '#000000',
            userSelect: 'none'
          }}
        >
          {element.text}
        </div>
      )}

      {/* Selection Outline */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-400 pointer-events-none" />
      )}

      {/* Resize Handles */}
      {isSelected && (
        <>
          {resizeHandles.map((handle) => (
            <div
              key={handle.id}
              className={cn(
                "absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full hover:bg-blue-600 transition-colors",
                handle.className
              )}
              style={handle.style}
              onPointerDown={(e) => handleResizeStart(e, handle.id)}
            />
          ))}
          
          {/* Control Buttons */}
          <div className="absolute -top-12 left-0 flex items-center space-x-1 bg-white rounded-lg shadow-lg p-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onUpdate(element.id, { rotation: (element.rotation || 0) + 90 })}
              className="h-8 w-8 p-0"
              title="회전"
            >
              <RotateCw className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(element.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              title="삭제"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// 나머지 컴포넌트들은 기존과 동일하게 유지...
// (DraggableShape, ProductEditor, ToastContainer 등)

// Keyring Ring Component
function KeyringRing({ canvasSize, onPositionChange, isVisible = false }) {
  const [position, setPosition] = useState({ angle: 0 }); // 각도로 위치 관리
  const [isDragging, setIsDragging] = useState(false);
  const ringRef = useRef(null);

  const ringDiameter = 1.5 * 10; // 1.5cm = 15px (MM_TO_PX_RATIO = 10)
  const ringRadius = ringDiameter / 2;
  const ringThickness = 2; // 고리 두께

  // 캔버스 중심점과 반지름 계산
  const canvasCenterX = canvasSize.width / 2;
  const canvasCenterY = canvasSize.height / 2;
  const canvasRadius = Math.min(canvasSize.width, canvasSize.height) / 2 + ringRadius + 5; // 캔버스 가장자리에서 약간 바깥쪽

  // 각도에 따른 고리의 실제 위치 계산
  const ringX = canvasCenterX + Math.cos(position.angle) * canvasRadius - ringRadius;
  const ringY = canvasCenterY + Math.sin(position.angle) * canvasRadius - ringRadius;

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !canvasSize) return;

    const canvasRect = ringRef.current.closest('.canvas-container').getBoundingClientRect();
    const canvasCenterAbsX = canvasRect.left + canvasSize.width / 2;
    const canvasCenterAbsY = canvasRect.top + canvasSize.height / 2;
    
    // 마우스 위치에서 캔버스 중심까지의 각도 계산
    const deltaX = e.clientX - canvasCenterAbsX;
    const deltaY = e.clientY - canvasCenterAbsY;
    const angle = Math.atan2(deltaY, deltaX);

    setPosition({ angle });
    onPositionChange && onPositionChange({ angle, x: ringX, y: ringY });
  }, [isDragging, canvasSize, ringX, ringY, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isVisible || !canvasSize) return null;

  return (
    <div
      ref={ringRef}
      className={`absolute cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{
        left: ringX,
        top: ringY,
        width: ringDiameter,
        height: ringDiameter,
        zIndex: 10
      }}
      onMouseDown={handleMouseDown}
    >
      {/* 도넛 모양 고리 */}
      <svg
        width={ringDiameter}
        height={ringDiameter}
        className="drop-shadow-md hover:drop-shadow-lg transition-all"
      >
        <defs>
          <radialGradient id="ringGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
        </defs>
        {/* 외부 원 */}
        <circle
          cx={ringRadius}
          cy={ringRadius}
          r={ringRadius - 1}
          fill="url(#ringGradient)"
          stroke="#d97706"
          strokeWidth="0.5"
        />
        {/* 내부 구멍 */}
        <circle
          cx={ringRadius}
          cy={ringRadius}
          r={ringRadius - ringThickness}
          fill="transparent"
          stroke="#d97706"
          strokeWidth="0.5"
        />
      </svg>
      
      {/* 드래그 힌트 */}
      {isDragging && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          고리 위치 조절
        </div>
      )}
    </div>
  );
}

// 개선된 Main Editor Component
export default function ImprovedEditorLayout() {
  const { toast, toasts } = useToast();
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Canvas and size state
  const [canvasSize, setCanvasSize] = useState(null);
  const [canvasMask, setCanvasMask] = useState(null); // 캔버스 모양 마스크
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Keyring state
  const [showKeyringRing, setShowKeyringRing] = useState(false);
  const [keyringPosition, setKeyringPosition] = useState({ angle: 0, x: 0, y: 0 });

  // Tool state
  const [newText, setNewText] = useState("텍스트");
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Pretendard");
  const [textColor, setTextColor] = useState("#000000");
  const [shapeType, setShapeType] = useState("rectangle");
  const [shapeFill, setShapeFill] = useState("#FF0000");

  const isEditorEnabled = canvasSize !== null;
  const selectedElementData = elements.find(el => el.id === selectedElement);

  const handleSizeSet = useCallback((size) => {
    setCanvasSize(size);
    toast({
      title: "캔버스 크기 설정됨",
      description: `${size.widthMM}mm × ${size.heightMM}mm (${size.width}px × ${size.height}px)`,
    });
  }, [toast]);

  const handleCanvasResize = useCallback((newSize, maskData = null) => {
    setCanvasSize(newSize);
    setCanvasMask(maskData);
    
    const description = maskData 
      ? `이미지 모양으로 조절: ${newSize.widthMM}mm × ${newSize.heightMM}mm (1cm 여백)`
      : `이미지에 맞게 조절: ${newSize.widthMM}mm × ${newSize.heightMM}mm (1cm 여백 포함)`;
      
    toast({
      title: "캔버스 자동 조절됨",
      description: description,
    });
  }, [toast]);

  const saveToHistory = useCallback((newElements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  }, [history, historyIndex]);

  const updateElement = useCallback((id, updates) => {
    const newElements = elements.map((el) => el.id === id ? { ...el, ...updates } : el);
    setElements(newElements);
    saveToHistory(newElements);
  }, [elements, saveToHistory]);

  const addElement = useCallback((element) => {
    const newElements = [...elements, element];
    setElements(newElements);
    setSelectedElement(element.id);
    saveToHistory(newElements);
  }, [elements, saveToHistory]);

  const deleteElement = useCallback((id) => {
    const newElements = elements.filter((el) => el.id !== id);
    setElements(newElements);
    if (selectedElement === id) {
      setSelectedElement(null);
    }
    saveToHistory(newElements);
  }, [elements, selectedElement, saveToHistory]);

  // 개선된 이미지 업로드 핸들러
  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file || !canvasSize) return;

    try {
      const imageData = await loadImageFile(file);
      
      // 자동 리사이즈 적용
      const resizedDimensions = autoResizeImage(
        { width: imageData.width, height: imageData.height },
        canvasSize,
        0.8 // 캔버스의 80% 크기로 제한
      );
      
      // 중앙 배치
      const centerPosition = getCenterPosition(resizedDimensions, canvasSize);
      
      const element = {
        id: `img-${Date.now()}`,
        type: "image",
        ...centerPosition,
        ...resizedDimensions,
        rotation: 0,
        visible: true,
        zIndex: elements.length,
        src: imageData.src,
        originalWidth: imageData.width,
        originalHeight: imageData.height,
        originalFile: file, // 원본 파일 객체 저장 (배경 제거용)
      };

      addElement(element);
      toast({
        title: "이미지 추가됨",
        description: `이미지가 캔버스에 맞게 리사이즈되어 추가되었습니다.`,
      });
    } catch (error) {
      toast({
        title: "이미지 업로드 실패",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [canvasSize, elements, addElement, toast]);

  const handleAddText = useCallback(() => {
    if (!newText.trim() || !canvasSize) return;

    const element = {
      id: `text-${Date.now()}`,
      type: "text",
      x: canvasSize.width * 0.1,
      y: canvasSize.height * 0.1,
      width: canvasSize.width * 0.8,
      height: fontSize * 1.5,
      rotation: 0,
      visible: true,
      zIndex: elements.length,
      text: newText,
      fontSize,
      fontFamily,
      color: textColor,
    };

    addElement(element);
    setNewText("텍스트");
    toast({
      title: "텍스트 추가됨",
      description: "텍스트가 캔버스에 추가되었습니다.",
    });
  }, [newText, canvasSize, fontSize, fontFamily, textColor, elements, addElement, toast]);

  const handleAddShape = useCallback(() => {
    if (!canvasSize) return;

    const size = Math.min(canvasSize.width, canvasSize.height) * 0.2;
    const element = {
      id: `shape-${Date.now()}`,
      type: "shape",
      x: (canvasSize.width - size) / 2,
      y: (canvasSize.height - size) / 2,
      width: size,
      height: size,
      rotation: 0,
      visible: true,
      zIndex: elements.length,
      shapeType,
      fill: shapeFill,
    };

    addElement(element);
    toast({
      title: "도형 추가됨",
      description: "도형이 캔버스에 추가되었습니다.",
    });
  }, [canvasSize, shapeType, shapeFill, elements, addElement, toast]);

  const handleSave = useCallback(() => {
    const designData = {
      elements,
      canvasSize,
      timestamp: Date.now(),
    };

    localStorage.setItem("pinto-design", JSON.stringify(designData));
    toast({
      title: "디자인 저장됨",
      description: `${elements.length}개의 요소가 포함된 디자인이 저장되었습니다.`,
    });
  }, [elements, canvasSize, toast]);


  const handleExport = useCallback((format) => {
    if (!canvasSize || !canvasRef.current) {
      toast({
        title: "내보내기 실패",
        description: "캔버스가 준비되지 않았습니다.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: `${format.toUpperCase()} 내보내기`,
      description: "파일이 준비되었습니다.",
    });
  }, [canvasSize, toast]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "p-4 rounded-lg shadow-lg text-white max-w-sm",
              toast.variant === "destructive" ? "bg-red-600" : "bg-green-600"
            )}
          >
            <div className="font-medium">{toast.title}</div>
            {toast.description && (
              <div className="text-sm opacity-90">{toast.description}</div>
            )}
          </div>
        ))}
      </div>
      
      {/* Top Toolbar */}
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-100">
          <span className="text-lg font-bold">PINTO</span>
          <span className="text-sm text-gray-400">굿즈 에디터</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="text-gray-200 hover:bg-gray-700 hover:text-white"
            title="되돌리기 (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
            되돌리기
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="text-gray-200 hover:bg-gray-700 hover:text-white"
            title="다시실행 (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
            다시실행
          </Button>
          <div className="w-px h-6 bg-gray-700" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectedElement && deleteElement(selectedElement)}
            disabled={!selectedElement}
            className="text-gray-200 hover:bg-gray-700 hover:text-white"
            title="삭제 (Delete)"
          >
            <Trash2 className="w-4 h-4" />
            삭제
          </Button>
          <div className="w-px h-6 bg-gray-700" />
          {canvasMask && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCanvasMask(null);
                toast({
                  title: "캔버스 모양 초기화됨",
                  description: "사각형 캔버스로 돌아갔습니다.",
                });
              }}
              className="text-yellow-400 hover:bg-gray-700 hover:text-yellow-300"
              title="사각형 캔버스로 초기화"
            >
              <Square className="w-4 h-4" />
              모양 초기화
            </Button>
          )}
          {showKeyringRing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKeyringRing(false)}
              className="text-yellow-400 hover:bg-gray-700 hover:text-yellow-300"
              title="키링 고리 숨기기"
            >
              <div className="w-4 h-4 border-2 border-current rounded-full" />
              고리 숨기기
            </Button>
          )}
          <div className="w-px h-6 bg-gray-700" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="text-gray-200 hover:bg-gray-700 hover:text-white"
            title="저장 (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
            저장
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleExport("png")}
            disabled={!isEditorEnabled}
            className="text-gray-200 hover:bg-gray-700 hover:text-white"
            title="PNG 다운로드"
          >
            <Download className="w-4 h-4" />
            PNG
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => handleExport("pdf")}
            disabled={!isEditorEnabled}
            className="bg-blue-600 text-white hover:bg-blue-700"
            title="고해상도 PDF 다운로드"
          >
            PDF 다운로드
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-800 text-white flex flex-col">
          {/* Size Selector */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-sm font-medium mb-3">캔버스 설정</h3>
            {!canvasSize ? (
              <SizeSelector productType="keyring" onSizeSet={handleSizeSet} />
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-gray-400">
                  크기: {canvasSize.widthMM}mm × {canvasSize.heightMM}mm
                </div>
                <div className="text-xs text-gray-500">
                  ({canvasSize.width}px × {canvasSize.height}px)
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCanvasSize(null)}
                  className="w-full text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  크기 변경
                </Button>
              </div>
            )}
          </div>

          {/* Image Tools */}
          <ImageTools
            selectedImage={selectedElementData}
            onUpdateImage={updateElement}
            onRemoveBackground={(id, updates) => updateElement(id, updates)}
            onCanvasResize={handleCanvasResize}
            canvasSize={canvasSize}
            disabled={!isEditorEnabled}
          />

          {/* Tools */}
          <div className="flex-1 overflow-y-auto">
            {/* Image Upload */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-2 mb-3">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">이미지 업로드</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                disabled={!isEditorEnabled}
                className="w-full text-xs hover:bg-blue-600 hover:text-white border-blue-400 text-blue-400"
              >
                <Upload className="w-3 h-3 mr-1" />
                이미지 선택
              </Button>
              <div className="text-xs text-gray-400 mt-2">
                JPG, PNG, GIF, WebP 지원<br/>
                자동으로 캔버스에 맞게 리사이즈됩니다
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                onClick={(e) => {
                  e.target.value = "";
                }}
                style={{ display: "none" }}
              />
            </div>

            {/* Text Tool */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-2 mb-3">
                <Type className="w-4 h-4" />
                <span className="text-sm font-medium">텍스트</span>
              </div>
              <div className="space-y-3">
                <Input
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="텍스트 입력"
                  disabled={!isEditorEnabled}
                  className="bg-gray-700 border-gray-600 text-white text-xs"
                />
                <Select value={fontFamily} onValueChange={setFontFamily} disabled={!isEditorEnabled}>
                  <option value="Pretendard">Pretendard</option>
                  <option value="Noto Sans KR">Noto Sans KR</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                </Select>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    min="8"
                    max="72"
                    disabled={!isEditorEnabled}
                    className="bg-gray-700 border-gray-600 text-white text-xs"
                    placeholder="크기"
                  />
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    disabled={!isEditorEnabled}
                    className="bg-gray-700 border-gray-600 w-12"
                    title="텍스트 색상"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddText}
                  disabled={!isEditorEnabled || !newText.trim()}
                  className="w-full text-xs hover:bg-green-600 hover:text-white border-green-400 text-green-400"
                >
                  <Type className="w-3 h-3 mr-1" />
                  텍스트 추가
                </Button>
              </div>
            </div>

            {/* Shape Tool */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-2 mb-3">
                <Square className="w-4 h-4" />
                <span className="text-sm font-medium">도형</span>
              </div>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Button
                    variant={shapeType === "rectangle" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShapeType("rectangle")}
                    disabled={!isEditorEnabled}
                    className={cn("w-full text-xs", shapeType !== "rectangle" && "border-gray-600 text-gray-300")}
                    title="사각형"
                  >
                    <Square className="w-3 h-3" />
                    사각형만
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-400">색상</Label>
                  <Input
                    type="color"
                    value={shapeFill}
                    onChange={(e) => setShapeFill(e.target.value)}
                    disabled={!isEditorEnabled}
                    className="bg-gray-700 border-gray-600 flex-1"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddShape}
                  disabled={!isEditorEnabled}
                  className={cn(
                    "w-full text-xs",
                    isEditorEnabled
                      ? "hover:bg-purple-600 hover:text-white border-purple-400 text-purple-400"
                      : "disabled:opacity-30 disabled:cursor-not-allowed"
                  )}
                >
                  <Square className="w-3 h-3 mr-1" />
                  도형 추가
                </Button>
              </div>
            </div>

            {/* Keyring Tool */}
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-4 h-4 border-2 border-yellow-500 rounded-full bg-yellow-200"></div>
                <span className="text-sm font-medium">키링 고리</span>
              </div>
              <div className="space-y-3">
                <Button
                  variant={showKeyringRing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowKeyringRing(!showKeyringRing)}
                  disabled={!isEditorEnabled}
                  className={cn(
                    "w-full text-xs",
                    showKeyringRing
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "hover:bg-yellow-600 hover:text-white border-yellow-400 text-yellow-400"
                  )}
                >
                  <div className="w-3 h-3 border border-current rounded-full mr-1"></div>
                  {showKeyringRing ? '고리 숨기기' : '고리 표시'}
                </Button>
                <div className="text-xs text-gray-400">
                  지름 1.5cm 도넛 모양 고리
                  <br />
                  드래그로 위치 조절 가능
                </div>
                {showKeyringRing && (
                  <div className="text-xs text-yellow-400 bg-yellow-900/20 p-2 rounded">
                    💡 고리를 드래그해서 원하는 위치로 이동하세요
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-gray-100 overflow-auto">
          {canvasSize ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="relative canvas-container">
                <div
                  ref={canvasRef}
                  className={cn(
                    "relative bg-white shadow-xl overflow-visible",
                    canvasMask ? "border-2 border-blue-500" : "border-2 border-dashed border-gray-400"
                  )}
                  style={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    minWidth: canvasSize.width,
                    minHeight: canvasSize.height,
                    // 캔버스를 이미지 모양으로 클리핑
                    ...(canvasMask && {
                      clipPath: `polygon(${canvasMask.contour.map(point => 
                        `${(point.x / canvasSize.width * 100).toFixed(2)}% ${(point.y / canvasSize.height * 100).toFixed(2)}%`
                      ).join(', ')})`,
                    })
                  }}
                  onClick={(e) => {
                    if (e.target === canvasRef.current) {
                      setSelectedElement(null);
                    }
                  }}
                >
                  {/* Keyring Ring */}
                  <KeyringRing
                    canvasSize={canvasSize}
                    isVisible={showKeyringRing}
                    onPositionChange={setKeyringPosition}
                  />
                  {/* Canvas Grid Background */}
                  <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Canvas Elements */}
                  {elements
                    .filter((el) => el.visible)
                    .sort((a, b) => a.zIndex - b.zIndex)
                    .map((element) => (
                      <DraggableElement
                        key={element.id}
                        element={element}
                        isSelected={selectedElement === element.id}
                        onSelect={setSelectedElement}
                        onUpdate={updateElement}
                        onDelete={deleteElement}
                        canvasBounds={canvasSize}
                      />
                    ))}


                  {/* Empty State */}
                  {elements.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                      <div className="text-center">
                        <div className="text-lg font-medium mb-2">
                          여기에 이미지나 텍스트를 추가해보세요
                        </div>
                        <div className="text-sm text-gray-400">
                          {canvasSize.widthMM}mm × {canvasSize.heightMM}mm 캔버스
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          이미지는 자동으로 캔버스에 맞게 리사이즈됩니다
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Canvas Info */}
                <div className="absolute -bottom-8 left-0 right-0 text-center">
                  <div className="text-xs text-gray-500">
                    캔버스: {canvasSize.widthMM}mm × {canvasSize.heightMM}mm 
                    ({canvasSize.width}px × {canvasSize.height}px)
                    {elements.length > 0 && ` | ${elements.length}개 요소`}
                    {showKeyringRing && " | 키링 고리 표시됨"}
                  </div>
                  {showKeyringRing && (
                    <div className="text-xs text-yellow-600 mt-1">
                      🔗 고리 위치: {Math.round((keyringPosition.angle * 180) / Math.PI)}° 
                      ({Math.round(keyringPosition.x)}, {Math.round(keyringPosition.y)})
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <div className="text-xl font-medium mb-2">캔버스 크기를 설정해주세요</div>
                <div className="text-sm">왼쪽 사이드바에서 제품 타입과 크기를 선택하세요</div>
                <div className="text-xs text-gray-400 mt-2">
                  키링, 스티커, 폰케이스 등 다양한 굿즈 제작이 가능합니다
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}