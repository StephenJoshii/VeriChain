export const startCamera = async (videoRef) => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  } else {
    throw new Error("Could not access webcam.");
  }
};

export const takeSnapshot = (videoRef) => {
  if (videoRef.current && videoRef.current.srcObject) {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/jpeg');
  }
  return null;
};