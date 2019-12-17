const video = document.getElementById('cam')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('app/models/'),
  faceapi.nets.faceLandmark68Net.loadFromUri('app/models/'),
  faceapi.nets.faceRecognitionNet.loadFromUri('app/models/'),
  faceapi.nets.faceExpressionNet.loadFromUri('app/models/')
]).then(start)

function start(){
   if (navigator.mediaDevices === undefined) {
                navigator.mediaDevices = {};
              }else{
  navigator.mediaDevices.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
  console.log('hhahhahhahah');
  }
}

video.addEventListener('play', () => {
  console.log("cccccccccccccc");
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width:video.clientWidth, height:video.clientHeight}
  // 这个是css设计的，所以要这样写
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})