/**
 * 이미지 처리 관련 유틸리티 함수들
 */

/**
 * 이미지를 캔버스 크기에 맞게 자동 리사이즈
 * @param {Object} imageSize - 원본 이미지 크기 {width, height}
 * @param {Object} canvasSize - 캔버스 크기 {width, height}
 * @param {number} maxRatio - 캔버스 대비 최대 비율 (기본값: 0.8)
 * @returns {Object} 리사이즈된 크기 {width, height}
 */
export function autoResizeImage(imageSize, canvasSize, maxRatio = 0.8) {
  const { width: imgWidth, height: imgHeight } = imageSize;
  const { width: canvasWidth, height: canvasHeight } = canvasSize;
  
  // 캔버스의 최대 허용 크기 계산
  const maxWidth = canvasWidth * maxRatio;
  const maxHeight = canvasHeight * maxRatio;
  
  // 이미지 비율 유지
  const aspectRatio = imgWidth / imgHeight;
  
  let newWidth = imgWidth;
  let newHeight = imgHeight;
  
  // 이미지가 최대 크기를 초과하는 경우 리사이즈
  if (imgWidth > maxWidth || imgHeight > maxHeight) {
    if (imgWidth / maxWidth > imgHeight / maxHeight) {
      // 가로가 더 큰 경우
      newWidth = maxWidth;
      newHeight = maxWidth / aspectRatio;
    } else {
      // 세로가 더 큰 경우
      newHeight = maxHeight;
      newWidth = maxHeight * aspectRatio;
    }
  }
  
  // 최소 크기 보장 (20px)
  const minSize = 20;
  if (newWidth < minSize || newHeight < minSize) {
    if (newWidth < newHeight) {
      newWidth = minSize;
      newHeight = minSize / aspectRatio;
    } else {
      newHeight = minSize;
      newWidth = minSize * aspectRatio;
    }
  }
  
  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight)
  };
}

/**
 * 이미지를 중앙에 배치할 좌표 계산
 * @param {Object} imageSize - 이미지 크기 {width, height}
 * @param {Object} canvasSize - 캔버스 크기 {width, height}
 * @returns {Object} 중앙 배치 좌표 {x, y}
 */
export function getCenterPosition(imageSize, canvasSize) {
  return {
    x: Math.round((canvasSize.width - imageSize.width) / 2),
    y: Math.round((canvasSize.height - imageSize.height) / 2)
  };
}

/**
 * 이미지 파일을 로드하고 크기 정보를 반환하는 Promise
 * @param {File} file - 이미지 파일
 * @returns {Promise<Object>} 이미지 정보 {src, width, height}
 */
export function loadImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('유효한 이미지 파일이 아닙니다.'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          src: event.target.result,
          width: img.width,
          height: img.height,
          file: file
        });
      };
      img.onerror = () => reject(new Error('이미지를 로드할 수 없습니다.'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.readAsDataURL(file);
  });
}

/**
 * 이미지 배경 제거 API 호출
 * @param {string} imageSrc - base64 이미지 데이터 또는 URL
 * @param {File} originalFile - 원본 파일 객체 (선택사항)
 * @returns {Promise<string>} 배경이 제거된 이미지의 base64 데이터
 */
export async function removeImageBackground(imageSrc, originalFile = null) {
  try {
    // 1. 서버 API 사용 시도 (remove.bg 또는 다른 AI API)
    if (originalFile) {
      try {
        const result = await removeBackgroundWithServerAPI(originalFile);
        if (result.success) {
          return result.imageData;
        }
      } catch (serverError) {
        console.warn('Server API failed:', serverError);
        throw new Error('Remove.bg API 처리 실패. API 키를 확인해주세요.');
      }
    }
    
    // 2. 클라이언트 사이드 처리로 폴백 (주석 처리됨)
    // return await clientSideBackgroundRemoval(imageSrc);
    
    throw new Error('배경 제거할 이미지를 찾을 수 없습니다.');
    
  } catch (error) {
    console.error('Background removal failed:', error);
    throw new Error('배경 제거에 실패했습니다. 다시 시도해주세요.');
  }
}

/**
 * 서버 API를 사용한 배경 제거
 * @param {File} file - 이미지 파일
 * @returns {Promise<Object>} 결과 객체
 */
export async function removeBackgroundWithServerAPI(file) {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('/api/remove-background', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Server API error: ${response.status}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Server processing failed');
  }
  
  return result;
}

/**
 * 클라이언트 사이드에서 고급 배경 제거
 * @param {string} imageSrc 
 * @returns {Promise<string>}
 */
async function clientSideBackgroundRemoval(imageSrc) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // 원본 이미지를 캔버스에 그리기
      ctx.drawImage(img, 0, 0);
      
      // 이미지 데이터 가져오기
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const width = canvas.width;
      const height = canvas.height;
      
      // 가장자리 픽셀들로부터 배경색 추정
      const backgroundColors = getBackgroundColors(data, width, height);
      
      // 고급 배경 제거 알고리즘
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          
          // 1. 배경색과 유사한지 확인
          const isBackground = isBackgroundPixel(r, g, b, backgroundColors);
          
          // 2. 가장자리와 연결된 영역인지 확인
          const connectedToEdge = isConnectedToEdge(x, y, data, width, height, backgroundColors);
          
          // 3. 그림자나 반사광 감지
          const isShadowOrReflection = detectShadowOrReflection(x, y, data, width, height);
          
          if (isBackground || (connectedToEdge && isShadowOrReflection)) {
            // 배경으로 판단되면 투명하게 처리
            data[idx + 3] = 0;
          } else {
            // 전경(사람)으로 판단되는 픽셀은 보존하되 가장자리를 부드럽게
            const edgeSmoothness = calculateEdgeSmoothness(x, y, data, width, height);
            data[idx + 3] = Math.min(255, data[idx + 3] * edgeSmoothness);
          }
        }
      }
      
      // 후처리: 노이즈 제거 및 가장자리 다듬기
      postProcessRemoval(data, width, height);
      
      // 처리된 이미지 데이터를 캔버스에 다시 그리기
      ctx.putImageData(imageData, 0, 0);
      
      // base64로 변환하여 반환
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.onerror = () => reject(new Error('이미지 로드 실패'));
    img.src = imageSrc;
  });
}

/**
 * 가장자리 픽셀들로부터 배경색 추정
 */
function getBackgroundColors(data, width, height) {
  const colors = [];
  const edgePixels = [];
  
  // 상단, 하단, 좌측, 우측 가장자리 픽셀 수집
  for (let x = 0; x < width; x++) {
    // 상단
    const topIdx = (0 * width + x) * 4;
    edgePixels.push([data[topIdx], data[topIdx + 1], data[topIdx + 2]]);
    
    // 하단
    const bottomIdx = ((height - 1) * width + x) * 4;
    edgePixels.push([data[bottomIdx], data[bottomIdx + 1], data[bottomIdx + 2]]);
  }
  
  for (let y = 0; y < height; y++) {
    // 좌측
    const leftIdx = (y * width + 0) * 4;
    edgePixels.push([data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]]);
    
    // 우측
    const rightIdx = (y * width + (width - 1)) * 4;
    edgePixels.push([data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]]);
  }
  
  // 색상 클러스터링으로 대표 배경색 찾기
  return clusterColors(edgePixels);
}

/**
 * 색상 클러스터링으로 대표 색상 찾기
 */
function clusterColors(pixels) {
  const colorMap = new Map();
  
  pixels.forEach(([r, g, b]) => {
    // 색상을 10단위로 반올림하여 유사한 색상끼리 그룹화
    const key = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  });
  
  // 가장 빈도가 높은 상위 3개 색상 반환
  return Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([color]) => color.split(',').map(Number));
}

/**
 * 픽셀이 배경색인지 판단
 */
function isBackgroundPixel(r, g, b, backgroundColors) {
  const threshold = 30; // 색상 차이 허용 범위
  
  return backgroundColors.some(([br, bg, bb]) => {
    const diff = Math.sqrt(
      Math.pow(r - br, 2) + Math.pow(g - bg, 2) + Math.pow(b - bb, 2)
    );
    return diff < threshold;
  });
}

/**
 * 픽셀이 가장자리와 연결되어 있는지 확인 (플러드 필 방식)
 */
function isConnectedToEdge(x, y, data, width, height) {
  // 성능상 간단한 방법: 인근 가장자리까지의 거리 확인
  const edgeDistance = Math.min(x, y, width - 1 - x, height - 1 - y);
  
  if (edgeDistance < 5) return true; // 가장자리에서 5픽셀 이내
  
  // 더 정교한 연결성 검사는 성능상 생략
  return false;
}

/**
 * 그림자나 반사광 감지
 */
function detectShadowOrReflection(x, y, data, width, height) {
  const idx = (y * width + x) * 4;
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  
  // 회색톤 (그림자) 감지
  const isGrayish = Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && Math.abs(r - b) < 15;
  const isDark = (r + g + b) / 3 < 120;
  
  // 매우 밝은 픽셀 (반사광) 감지
  const isBright = (r + g + b) / 3 > 220;
  
  return (isGrayish && isDark) || isBright;
}

/**
 * 가장자리 부드러움 계산
 */
function calculateEdgeSmoothness(x, y, data, width, height) {
  // 주변 픽셀들의 알파값 변화율을 보고 가장자리 부드러움 결정
  let transparentNeighbors = 0;
  let totalNeighbors = 0;
  
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      
      const nx = x + dx;
      const ny = y + dy;
      
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = (ny * width + nx) * 4;
        if (data[nIdx + 3] < 128) transparentNeighbors++;
        totalNeighbors++;
      }
    }
  }
  
  const transparentRatio = transparentNeighbors / totalNeighbors;
  
  // 투명한 이웃이 많을수록 가장자리로 판단하여 부드럽게 처리
  if (transparentRatio > 0.5) {
    return 0.7; // 반투명
  } else if (transparentRatio > 0.2) {
    return 0.9; // 약간 투명
  }
  
  return 1.0; // 완전 불투명
}

/**
 * 후처리: 노이즈 제거 및 가장자리 다듬기
 */
function postProcessRemoval(data, width, height) {
  // 작은 노이즈 제거 (고립된 투명 픽셀들)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      if (data[idx + 3] === 0) { // 투명 픽셀인 경우
        // 주변 8개 픽셀 중 불투명한 픽셀이 6개 이상이면 노이즈로 판단
        let opaqueNeighbors = 0;
        
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            
            const nIdx = ((y + dy) * width + (x + dx)) * 4;
            if (data[nIdx + 3] > 128) opaqueNeighbors++;
          }
        }
        
        if (opaqueNeighbors >= 6) {
          // 노이즈로 판단하여 복원
          data[idx + 3] = 255;
        }
      }
    }
  }
}

/**
 * 외부 AI API를 사용한 배경 제거 (remove.bg API 예시)
 * 실제 사용 시 API 키가 필요합니다
 * @param {string} imageSrc 
 * @returns {Promise<string>}
 */
export async function removeBackgroundWithAPI(imageSrc) {
  // 이 부분은 실제 API 키가 있을 때 사용
  const API_KEY = process.env.NEXT_PUBLIC_REMOVEBG_API_KEY;
  
  if (!API_KEY) {
    throw new Error('API 키가 설정되지 않았습니다.');
  }
  
  try {
    // base64에서 Blob으로 변환
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    
    // FormData 생성
    const formData = new FormData();
    formData.append('image_file', blob);
    formData.append('size', 'auto');
    
    // remove.bg API 호출
    const apiResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
      },
      body: formData,
    });
    
    if (!apiResponse.ok) {
      throw new Error(`API Error: ${apiResponse.status}`);
    }
    
    const resultBlob = await apiResponse.blob();
    
    // Blob을 base64로 변환
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(resultBlob);
    });
    
  } catch (error) {
    console.error('API background removal failed:', error);
    throw error;
  }
}

/**
 * 이미지 품질 최적화
 * @param {string} imageSrc 
 * @param {number} quality - 0.1 ~ 1.0
 * @param {number} maxWidth - 최대 가로 크기
 * @returns {Promise<string>}
 */
export async function optimizeImage(imageSrc, quality = 0.9, maxWidth = 1920) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // 크기 계산
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // 이미지 그리기
      ctx.drawImage(img, 0, 0, width, height);
      
      // 최적화된 이미지 반환
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    
    img.onerror = () => reject(new Error('이미지 최적화 실패'));
    img.src = imageSrc;
  });
}

/**
 * 이미지 윤곽선 추출 및 절취선 생성
 * @param {string} imageSrc - 배경이 제거된 이미지 (투명 PNG)
 * @param {number} marginCm - 여백 크기 (cm 단위, 기본 1cm)
 * @param {number} pixelsPerCm - 1cm당 픽셀 수 (기본 37.8픽셀/cm)
 * @returns {Promise<Object>} 절취선 정보 {path, boundingBox}
 */
export async function generateCutLine(imageSrc, marginCm = 1, pixelsPerCm = 37.8) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        // 이미지 데이터 추출
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // 윤곽선 추출
        const contour = extractContour(data, canvas.width, canvas.height);
        
        // 여백 추가한 절취선 생성
        const marginPixels = marginCm * pixelsPerCm;
        const cutLine = expandContour(contour, marginPixels);
        
        // SVG 패스 생성
        const pathString = contourToSvgPath(cutLine);
        
        // 바운딩 박스 계산
        const boundingBox = calculateBoundingBox(cutLine);
        
        resolve({
          path: pathString,
          contour: cutLine,
          boundingBox: boundingBox,
          marginCm: marginCm
        });
        
      } catch (error) {
        reject(new Error('윤곽선 추출 실패: ' + error.message));
      }
    };
    
    img.onerror = () => reject(new Error('이미지 로드 실패'));
    img.src = imageSrc;
  });
}

/**
 * OpenCV.js를 사용한 정확한 윤곽선 추출
 */
function extractContour(imageData, width, height) {
  // 입력 데이터 유효성 검사
  if (!imageData || !width || !height || !imageData.data) {
    console.warn('Invalid imageData provided, using fallback method');
    return extractContourFallback(imageData, width, height);
  }

  // 임시로 OpenCV 비활성화 - 픽셀 분석 방식만 사용
  console.warn('🚫 OpenCV.js 임시 비활성화 - 픽셀 분석 방식 사용');
  return extractContourFallback(imageData, width, height);

  // OpenCV가 로드되지 않았으면 폴백
  if (typeof cv === 'undefined' || typeof cv.matFromImageData !== 'function') {
    console.warn('OpenCV.js not loaded or matFromImageData not available, using fallback method');
    return extractContourFallback(imageData, width, height);
  }

  try {
    // ImageData를 OpenCV Mat으로 변환
    const src = cv.matFromImageData(imageData);
    const gray = new cv.Mat();
    const binary = new cv.Mat();
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();

    // RGBA를 Grayscale로 변환
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    
    // 이진화: 투명하지 않은 부분만 추출
    cv.threshold(gray, binary, 50, 255, cv.THRESH_BINARY);
    
    // 윤곽선 찾기
    cv.findContours(binary, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let largestContour = null;
    let maxArea = 0;

    // 가장 큰 윤곽선 찾기
    for (let i = 0; i < contours.size(); i++) {
      const contour = contours.get(i);
      const area = cv.contourArea(contour);
      if (area > maxArea) {
        maxArea = area;
        if (largestContour) largestContour.delete();
        largestContour = contour.clone();
      }
      contour.delete();
    }

    // 윤곽선을 점 배열로 변환
    const contourPoints = [];
    if (largestContour && maxArea > 100) { // 최소 면적 체크
      const approx = new cv.Mat();
      
      // 윤곽선 단순화 (더 부드럽게)
      const epsilon = 0.02 * cv.arcLength(largestContour, true);
      cv.approxPolyDP(largestContour, approx, epsilon, true);
      
      // 점들을 JavaScript 배열로 변환
      for (let i = 0; i < approx.rows; i++) {
        const point = approx.intPtr(i, 0);
        contourPoints.push({
          x: point[0],
          y: point[1]
        });
      }
      
      approx.delete();
    }

    // 메모리 정리
    src.delete();
    gray.delete();
    binary.delete();
    contours.delete();
    hierarchy.delete();
    if (largestContour) largestContour.delete();

    // 충분한 점이 없으면 폴백 사용
    if (contourPoints.length < 8) {
      console.warn('Not enough contour points, using fallback method');
      return extractContourFallback(imageData, width, height);
    }

    return contourPoints;

  } catch (error) {
    console.error('OpenCV contour extraction failed:', error);
    return extractContourFallback(imageData, width, height);
  }
}

/**
 * 폴백: 간단한 사각형 윤곽선 생성
 */
function extractContourFallback(imageData, width, height) {
  console.log('🔍 extractContourFallback 시작 - 이미지 크기:', width, 'x', height);
  
  // 투명하지 않은 픽셀들의 경계 찾기
  let minX = width, minY = height;
  let maxX = 0, maxY = 0;
  let hasContent = false;
  let totalPixels = 0;
  let opaquePixels = 0;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const alpha = imageData[idx + 3];
      totalPixels++;
      
      if (alpha > 128) { // 반투명 이상인 픽셀만
        hasContent = true;
        opaquePixels++;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  
  console.log('📊 픽셀 분석 결과:');
  console.log('- 전체 픽셀:', totalPixels);
  console.log('- 불투명 픽셀:', opaquePixels);
  console.log('- 불투명 픽셀 비율:', (opaquePixels/totalPixels*100).toFixed(1) + '%');
  console.log('- 경계:', { minX, minY, maxX, maxY });
  console.log('- 실제 컨텐츠 크기:', (maxX - minX + 1), 'x', (maxY - minY + 1));
  
  if (!hasContent) {
    console.log('❌ 컨텐츠를 찾을 수 없음');
    return [];
  }
  
  // 사각형 윤곽선 생성 (시계 방향)
  const contourPoints = [
    { x: minX, y: minY }, // 좌상단
    { x: maxX, y: minY }, // 우상단  
    { x: maxX, y: maxY }, // 우하단
    { x: minX, y: maxY }  // 좌하단
  ];
  
  console.log('✅ 윤곽선 점들:', contourPoints);
  return contourPoints;
}

/**
 * 픽셀이 가장자리인지 확인
 */
function isEdgePixel(imageData, x, y, width, height) {
  const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  
  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
      return true; // 경계 밖
    }
    
    const nIdx = (ny * width + nx) * 4;
    if (imageData[nIdx + 3] === 0) {
      return true; // 투명한 이웃 픽셀이 있음
    }
  }
  
  return false;
}

/**
 * 윤곽선 점들을 연결된 순서로 정렬
 */
function sortContourPoints(points) {
  if (points.length === 0) return [];
  
  const sorted = [points[0]];
  const remaining = [...points.slice(1)];
  
  while (remaining.length > 0) {
    const current = sorted[sorted.length - 1];
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    
    for (let i = 0; i < remaining.length; i++) {
      const distance = Math.sqrt(
        Math.pow(remaining[i].x - current.x, 2) + 
        Math.pow(remaining[i].y - current.y, 2)
      );
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }
    
    sorted.push(remaining[nearestIndex]);
    remaining.splice(nearestIndex, 1);
  }
  
  return sorted;
}

/**
 * 윤곽선을 여백만큼 확장
 */
function expandContour(contour, marginPixels) {
  if (contour.length === 0) return [];
  
  const expanded = [];
  
  for (let i = 0; i < contour.length; i++) {
    const current = contour[i];
    const prev = contour[i === 0 ? contour.length - 1 : i - 1];
    const next = contour[(i + 1) % contour.length];
    
    // 현재 점에서의 법선 벡터 계산
    const normal = calculateNormal(prev, current, next);
    
    // 여백만큼 바깥쪽으로 이동
    expanded.push({
      x: current.x + normal.x * marginPixels,
      y: current.y + normal.y * marginPixels
    });
  }
  
  return expanded;
}

/**
 * 점에서의 법선 벡터 계산
 */
function calculateNormal(prev, current, next) {
  // 이전 점과 다음 점을 연결한 벡터의 법선
  const dx = next.x - prev.x;
  const dy = next.y - prev.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  if (length === 0) {
    return { x: 0, y: -1 }; // 기본 법선
  }
  
  // 시계 반대방향으로 90도 회전 (바깥쪽 법선)
  return {
    x: -dy / length,
    y: dx / length
  };
}

/**
 * 윤곽선을 SVG 패스로 변환
 */
function contourToSvgPath(contour) {
  if (contour.length === 0) return '';
  
  let path = `M ${contour[0].x} ${contour[0].y}`;
  
  for (let i = 1; i < contour.length; i++) {
    path += ` L ${contour[i].x} ${contour[i].y}`;
  }
  
  path += ' Z'; // 패스 닫기
  
  return path;
}

/**
 * 윤곽선의 바운딩 박스 계산
 */
function calculateBoundingBox(contour) {
  if (contour.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  
  for (const point of contour) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * 다이컷 스티커 형태의 투명 PNG 생성
 * - 배경을 완전히 투명하게 제거
 * - 이미지의 자연스러운 윤곽선을 따라 정확하게 잘라냄
 * - 상단 중앙에 작은 원형 탭(걸이용 구멍) 추가
 * @param {string} imageSrc - 원본 이미지
 * @param {Object} options - 옵션 {tabSize: number, quality: number}
 * @returns {Promise<string>} 다이컷 스티커 이미지 (base64 data URL)
 */
export async function generateDieCutSticker(imageSrc, options = {}) {
  const { tabSize = 20, quality = 1.0 } = options;
  
  return new Promise(async (resolve, reject) => {
    try {
      // 1단계: 먼저 배경을 제거한 투명 이미지 생성
      const transparentImageSrc = await removeImageBackground(imageSrc);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        try {
          // 이미지 데이터 추출
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // 윤곽선 추출
          const contour = extractContour(data, canvas.width, canvas.height);
          
          if (contour.length === 0) {
            throw new Error('윤곽선을 찾을 수 없습니다');
          }
          
          // 바운딩 박스 계산
          const boundingBox = calculateBoundingBox(contour);
          
          // 탭을 포함한 새 캔버스 크기 계산
          const padding = tabSize;
          const newCanvas = document.createElement('canvas');
          const newCtx = newCanvas.getContext('2d');
          
          newCanvas.width = boundingBox.width + padding * 2;
          newCanvas.height = boundingBox.height + padding * 2 + tabSize;
          
          // 투명 배경으로 초기화
          newCtx.clearRect(0, 0, newCanvas.width, newCanvas.height);
          
          // 윤곽선 마스크 생성
          newCtx.save();
          
          // 윤곽선 패스 생성 (좌표 조정)
          newCtx.beginPath();
          const adjustedContour = contour.map(point => ({
            x: point.x - boundingBox.x + padding,
            y: point.y - boundingBox.y + padding + tabSize
          }));
          
          if (adjustedContour.length > 0) {
            newCtx.moveTo(adjustedContour[0].x, adjustedContour[0].y);
            for (let i = 1; i < adjustedContour.length; i++) {
              newCtx.lineTo(adjustedContour[i].x, adjustedContour[i].y);
            }
            newCtx.closePath();
          }
          
          // 상단 중앙에 원형 탭 추가
          const tabCenterX = newCanvas.width / 2;
          const tabCenterY = tabSize / 2;
          newCtx.moveTo(tabCenterX + tabSize / 2, tabCenterY);
          newCtx.arc(tabCenterX, tabCenterY, tabSize / 2, 0, 2 * Math.PI);
          
          // 마스크 적용
          newCtx.clip();
          
          // 마스크된 영역에 원본 이미지 그리기
          newCtx.drawImage(
            img, 
            boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height,
            padding, padding + tabSize, boundingBox.width, boundingBox.height
          );
          
          newCtx.restore();
          
          // 다이컷 스티커 이미지 생성
          const dieCutImageData = newCanvas.toDataURL('image/png', quality);
          
          resolve({
            imageData: dieCutImageData,
            width: newCanvas.width,
            height: newCanvas.height,
            originalBounds: boundingBox,
            tabSize: tabSize
          });
          
        } catch (error) {
          reject(new Error('다이컷 스티커 생성 실패: ' + error.message));
        }
      };
      
      img.onerror = () => reject(new Error('이미지 로드 실패'));
      img.crossOrigin = 'anonymous';
      img.src = transparentImageSrc;
      
    } catch (error) {
      reject(new Error('배경 제거 실패: ' + error.message));
    }
  });
}

/**
 * 고품질 다이컷 스티커 PNG 다운로드
 * @param {string} imageSrc - 원본 이미지
 * @param {string} filename - 다운로드할 파일명
 * @param {Object} options - 옵션 {tabSize: number, quality: number}
 */
export async function downloadDieCutSticker(imageSrc, filename = 'die-cut-sticker.png', options = {}) {
  try {
    const stickerData = await generateDieCutSticker(imageSrc, options);
    
    // 다운로드 링크 생성
    const link = document.createElement('a');
    link.href = stickerData.imageData;
    link.download = filename;
    
    // 다운로드 실행
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return stickerData;
    
  } catch (error) {
    throw new Error('다이컷 스티커 다운로드 실패: ' + error.message);
  }
}

/**
 * 이미지의 실제 내용물 크기 감지 (투명 배경 제외)
 * @param {string} imageSrc - 이미지 소스 (투명 배경이 제거된 이미지)
 * @returns {Promise<Object>} {width, height, boundingBox, pixelsPerMm}
 */
export async function detectImageContentSize(imageSrc) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        // 이미지 데이터 추출
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // 투명하지 않은 픽셀들의 경계 찾기
        let minX = canvas.width, minY = canvas.height;
        let maxX = 0, maxY = 0;
        let hasContent = false;
        
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const alpha = data[idx + 3]; // 알파 채널
            
            if (alpha > 0) { // 투명하지 않은 픽셀
              hasContent = true;
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }
          }
        }
        
        if (!hasContent) {
          throw new Error('이미지에 내용이 없습니다');
        }
        
        // 실제 내용물 크기 계산 (픽셀)
        const contentWidthPx = maxX - minX + 1;
        const contentHeightPx = maxY - minY + 1;
        
        // 픽셀을 mm로 변환 (일반적으로 1인치 = 96픽셀, 1인치 = 25.4mm)
        const pixelsPerMm = 96 / 25.4; // 약 3.78 픽셀/mm
        const contentWidthMm = contentWidthPx / pixelsPerMm;
        const contentHeightMm = contentHeightPx / pixelsPerMm;
        
        resolve({
          widthPx: contentWidthPx,
          heightPx: contentHeightPx,
          widthMm: Math.round(contentWidthMm * 10) / 10, // 소수점 1자리
          heightMm: Math.round(contentHeightMm * 10) / 10,
          boundingBox: { minX, minY, maxX, maxY },
          pixelsPerMm: pixelsPerMm
        });
        
      } catch (error) {
        reject(new Error('이미지 크기 감지 실패: ' + error.message));
      }
    };
    
    img.onerror = () => reject(new Error('이미지 로드 실패'));
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
  });
}

/**
 * 이미지에 맞는 캔버스 크기 계산 (1cm 여백 포함)
 * @param {string} imageSrc - 투명 배경이 제거된 이미지
 * @param {number} marginCm - 여백 크기 (cm 단위, 기본 1cm)
 * @returns {Promise<Object>} 캔버스 크기 정보
 */
export async function calculateCanvasSizeForImage(imageSrc, marginCm = 1) {
  try {
    const contentSize = await detectImageContentSize(imageSrc);
    
    // mm 단위로 여백 추가 (양쪽에 각각 marginCm씩)
    const marginMm = marginCm * 10; // cm를 mm로 변환
    const canvasWidthMm = contentSize.widthMm + (marginMm * 2);
    const canvasHeightMm = contentSize.heightMm + (marginMm * 2);
    
    // 픽셀 단위로 변환 (MM_TO_PX_RATIO = 10 사용)
    const MM_TO_PX_RATIO = 10;
    const canvasWidthPx = Math.round(canvasWidthMm * MM_TO_PX_RATIO);
    const canvasHeightPx = Math.round(canvasHeightMm * MM_TO_PX_RATIO);
    
    return {
      width: canvasWidthPx,
      height: canvasHeightPx,
      widthMM: Math.round(canvasWidthMm * 10) / 10,
      heightMM: Math.round(canvasHeightMm * 10) / 10,
      contentSize: contentSize,
      marginCm: marginCm
    };
    
  } catch (error) {
    throw new Error('캔버스 크기 계산 실패: ' + error.message);
  }
}

/**
 * 클라이언트 사이드에서 알파 매트 이미지의 실제 픽셀 바운딩 박스 계산
 * GitHub 커뮤니티 방식과 결합
 */
export const analyzeImagePixelBounds = (imageDataUrl) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('🔍 클라이언트 픽셀 분석 시작...');
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // 이미지 데이터 가져오기
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;
        
        let minX = img.width;
        let minY = img.height;
        let maxX = 0;
        let maxY = 0;
        let pixelCount = 0;
        
        // 투명하지 않은 픽셀 찾기
        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            const alpha = data[(y * img.width + x) * 4 + 3]; // 알파 채널
            
            // 투명하지 않은 픽셀 (임계값 10 이상)
            if (alpha > 10) {
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
              pixelCount++;
            }
          }
        }
        
        // 유효한 바운딩 박스가 발견되지 않으면 전체 이미지 사용
        if (minX >= maxX || minY >= maxY || pixelCount === 0) {
          console.warn('⚠️ 유효한 객체를 찾을 수 없음, 전체 이미지 사용');
          resolve({
            boundingBox: { x: 0, y: 0, width: img.width, height: img.height },
            imageSize: { width: img.width, height: img.height },
            confidence: 0.5,
            method: 'full_image_fallback',
            pixelCount: img.width * img.height
          });
          return;
        }
        
        // GitHub 커뮤니티 방식: 바운딩 박스 계산
        const boundingBox = {
          x: minX,
          y: minY, 
          width: maxX - minX + 1,
          height: maxY - minY + 1
        };
        
        console.log('✅ 실제 픽셀 바운딩 박스:', boundingBox);
        console.log('📊 투명하지 않은 픽셀 수:', pixelCount);
        
        resolve({
          boundingBox,
          imageSize: { width: img.width, height: img.height },
          confidence: 0.95,
          method: 'client_pixel_analysis',
          pixelCount: pixelCount
        });
      };
      
      img.onerror = () => {
        reject(new Error('이미지 로딩 실패'));
      };
      
      img.src = imageDataUrl;
      
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 이미지 모양에 맞는 캔버스 마스크 생성 (1cm 여백 포함)
 * @param {string} imageSrc - 투명 배경이 제거된 이미지
 * @param {number} marginCm - 여백 크기 (cm 단위, 기본 1cm)
 * @returns {Promise<Object>} 캔버스 마스크 정보
 */
export async function generateCanvasShapeMask(imageSrc, marginCm = 1) {
  return new Promise((resolve, reject) => {
    console.log('🎭 generateCanvasShapeMask 시작');
    console.log('- 이미지 소스 타입:', imageSrc.substring(0, 30) + '...');
    console.log('- 여백:', marginCm + 'cm');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      console.log('📸 이미지 로드 완료 - 원본 크기:', img.width, 'x', img.height);
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        // 이미지 데이터 추출
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log('📊 ImageData 추출 완료 - 데이터 크기:', imageData.data.length);
        
        // 윤곽선 추출
        const contour = extractContour(imageData, canvas.width, canvas.height);
        
        console.log('🔍 윤곽선 추출 결과:', contour.length, '개 점');
        if (contour.length === 0) {
          console.error('❌ 윤곽선을 찾을 수 없습니다 - 이미지에 투명하지 않은 픽셀이 없을 수 있음');
          // 기본 사각형으로 폴백
          console.log('🔄 기본 사각형으로 폴백');
          const fallbackContour = [
            { x: 0, y: 0 },
            { x: canvas.width, y: 0 },
            { x: canvas.width, y: canvas.height },
            { x: 0, y: canvas.height }
          ];
          // 기본 사각형으로 폴백 처리
          const marginPixels = marginCm * 37.8;
          const expandedContour = expandContour(fallbackContour, marginPixels);
          const pathString = contourToSvgPath(expandedContour);
          const boundingBox = calculateBoundingBox(expandedContour);
          
          const pixelsPerMm = 37.8 / 10;
          const canvasWidthMm = boundingBox.width / pixelsPerMm;
          const canvasHeightMm = boundingBox.height / pixelsPerMm;
          const MM_TO_PX_RATIO = 10;
          const canvasWidthPx = Math.round(canvasWidthMm * MM_TO_PX_RATIO);
          const canvasHeightPx = Math.round(canvasHeightMm * MM_TO_PX_RATIO);
          
          const adjustedContour = expandedContour.map(point => ({
            x: (point.x - boundingBox.x) * (canvasWidthPx / boundingBox.width),
            y: (point.y - boundingBox.y) * (canvasHeightPx / boundingBox.height)
          }));
          
          const adjustedPathString = contourToSvgPath(adjustedContour);
          
          return resolve({
            width: canvasWidthPx,
            height: canvasHeightPx,
            widthMM: Math.round(canvasWidthMm * 10) / 10,
            heightMM: Math.round(canvasHeightMm * 10) / 10,
            maskPath: adjustedPathString,
            contour: adjustedContour,
            boundingBox: { x: 0, y: 0, width: canvasWidthPx, height: canvasHeightPx },
            marginCm: marginCm,
            originalContour: expandedContour,
            originalBoundingBox: boundingBox
          });
        }
        
        // 여백 추가한 윤곽선 생성
        const marginPixels = marginCm * 37.8; // 1cm ≈ 37.8px
        const expandedContour = expandContour(contour, marginPixels);
        
        // SVG 패스 생성
        const pathString = contourToSvgPath(expandedContour);
        
        // 바운딩 박스 계산
        const boundingBox = calculateBoundingBox(expandedContour);
        
        // 캔버스 크기 계산 (mm 단위)
        const pixelsPerMm = 37.8 / 10; // 1mm ≈ 3.78px
        const canvasWidthMm = boundingBox.width / pixelsPerMm;
        const canvasHeightMm = boundingBox.height / pixelsPerMm;
        
        // 픽셀 단위로 변환 (MM_TO_PX_RATIO = 10 사용)
        const MM_TO_PX_RATIO = 10;
        const canvasWidthPx = Math.round(canvasWidthMm * MM_TO_PX_RATIO);
        const canvasHeightPx = Math.round(canvasHeightMm * MM_TO_PX_RATIO);
        
        // 좌표를 캔버스 중앙에 맞추기 위한 조정된 윤곽선 생성
        const adjustedContour = expandedContour.map(point => ({
          x: (point.x - boundingBox.x) * (canvasWidthPx / boundingBox.width),
          y: (point.y - boundingBox.y) * (canvasHeightPx / boundingBox.height)
        }));
        
        // 조정된 SVG 패스 생성
        const adjustedPathString = contourToSvgPath(adjustedContour);
        
        resolve({
          // 캔버스 크기 정보
          width: canvasWidthPx,
          height: canvasHeightPx,
          widthMM: Math.round(canvasWidthMm * 10) / 10,
          heightMM: Math.round(canvasHeightMm * 10) / 10,
          
          // 마스크 정보 (캔버스 크기에 맞게 조정됨)
          maskPath: adjustedPathString,
          contour: adjustedContour,
          boundingBox: {
            x: 0,
            y: 0,
            width: canvasWidthPx,
            height: canvasHeightPx
          },
          marginCm: marginCm,
          
          // 원본 정보 (디버깅용)
          originalContour: expandedContour,
          originalBoundingBox: boundingBox
        });
        
      } catch (error) {
        reject(new Error('캔버스 모양 마스크 생성 실패: ' + error.message));
      }
    };
    
    img.onerror = () => reject(new Error('이미지 로드 실패'));
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
  });
}