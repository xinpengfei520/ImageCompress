document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const previewContainer = document.getElementById('previewContainer');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImage = null;

    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // 处理拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#DEDEDE';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#DEDEDE';
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            processImage(file);
        }
    });

    // 处理文件选择
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            processImage(file);
        }
    });

    // 处理图片压缩
    function processImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = () => {
                // 显示原始图片
                originalPreview.src = originalImage.src;
                originalSize.textContent = formatFileSize(file.size);
                
                // 显示预览区域
                previewContainer.style.display = 'block';
                
                // 压缩图片
                compressImage();
            };
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        
        ctx.drawImage(originalImage, 0, 0);
        
        const quality = qualitySlider.value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        compressedPreview.src = compressedDataUrl;
        
        // 计算压缩后的文件大小
        const base64str = compressedDataUrl.split(',')[1];
        const compressedBytes = atob(base64str).length;
        compressedSize.textContent = formatFileSize(compressedBytes);
    }

    // 质量滑块变化时重新压缩
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value + '%';
        if (originalImage) {
            compressImage();
        }
    });

    // 下载压缩后的图片
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'compressed-image.jpg';
        link.href = compressedPreview.src;
        link.click();
    });

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 