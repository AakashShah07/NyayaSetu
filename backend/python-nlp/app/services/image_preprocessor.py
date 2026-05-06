try:
    import cv2
    import numpy as np
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False

from PIL import Image


def preprocess_for_ocr(pil_image: Image.Image) -> Image.Image:
    """Preprocess a PIL image for better OCR accuracy.
    Steps: grayscale -> denoise -> threshold -> deskew.
    Falls back to simple grayscale if OpenCV is not available.
    """
    if not CV2_AVAILABLE:
        return pil_image.convert("L")

    img = np.array(pil_image)

    # Convert to grayscale if needed
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    else:
        gray = img

    # Denoise
    denoised = cv2.fastNlMeansDenoising(gray, h=10)

    # Otsu threshold binarization
    _, binary = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Deskew
    binary = _deskew(binary)

    return Image.fromarray(binary)


def _deskew(image) -> "np.ndarray":
    """Detect and correct skew angle using minAreaRect on contours."""
    coords = np.column_stack(np.where(image < 128))
    if len(coords) < 50:
        return image

    rect = cv2.minAreaRect(coords)
    angle = rect[-1]

    # Normalize angle
    if angle < -45:
        angle = -(90 + angle)
    elif angle > 45:
        angle = -(angle - 90)
    else:
        angle = -angle

    # Only correct if skew is significant but not extreme
    if abs(angle) < 0.5 or abs(angle) > 15:
        return image

    h, w = image.shape[:2]
    center = (w // 2, h // 2)
    matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(
        image, matrix, (w, h),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_REPLICATE,
    )
    return rotated
