(async () => {
  let leftchannel = [];
  let rightchannel = [];
  let recorder = null;
  let recording = false;
  let recordingLength = 0;
  let volume = null;
  let audioInput = null;
  let sampleRate = null;
  let AudioContext = window.AudioContext || window.webkitAudioContext;
  let context = null;
  let analyser = null;
  let canvas = document.querySelector('canvas');
  let canvasCtx = canvas.getContext("2d");
  let visualSelect = document.querySelector('#visSelect');
  let micSelect = document.querySelector('#micSelect');
  let stream = null;
  let tested = false;
  // let encoder = null;
  let worker = new Worker('EncoderWorker.js');
  worker.onmessage = function(event) { saveRecording(event.data.blob); };
  
  try {
    window.stream = stream = await getStream();
    console.log('Got stream');  
  } catch(err) {
    alert('Issue getting mic', err);
  }
  
  const deviceInfos = await navigator.mediaDevices.enumerateDevices();
  
  var mics = [];
  for (let i = 0; i !== deviceInfos.length; ++i) {
    let deviceInfo = deviceInfos[i];
    if (deviceInfo.kind === 'audioinput') {
      mics.push(deviceInfo);
      let label = deviceInfo.label ||
        'Microphone ' + mics.length;
      console.log('Mic ', label + ' ' + deviceInfo.deviceId)
      const option = document.createElement('option')
      option.value = deviceInfo.deviceId;
      option.text = label;
      micSelect.appendChild(option);
    }
  }
  
  function getStream(constraints) {
    if (!constraints) {
      constraints = { audio: true, video: false };
    }
    return navigator.mediaDevices.getUserMedia(constraints);
  }
  
  
  setUpRecording();
  
  function setUpRecording() {
    context = new AudioContext();
    sampleRate = context.sampleRate;
    
    // creates a gain node
    volume = context.createGain();
    
    // creates an audio node from teh microphone incoming stream
    audioInput = context.createMediaStreamSource(stream);
    
    // Create analyser
    analyser = context.createAnalyser();
    
    // connect audio input to the analyser
    audioInput.connect(analyser);
    
    // connect analyser to the volume control
    // analyser.connect(volume);
    
    let bufferSize = 2048;
    let recorder = context.createScriptProcessor(bufferSize, 2, 2);
    
    // we connect the volume control to the processor
    // volume.connect(recorder);
    
    analyser.connect(recorder);
    
    // finally connect the processor to the output
    recorder.connect(context.destination);

    recorder.onaudioprocess = function(e) {
      // Check 
      if (!recording) return;
      // Do something with the data, i.e Convert this to WAV
      console.log('recording');
      let left = e.inputBuffer.getChannelData(0);
      let right = e.inputBuffer.getChannelData(1);
      if (!tested) {
        tested = true;
        // if this reduces to 0 we are not getting any sound
        if ( !left.reduce((a, b) => a + b) ) {
          alert("There seems to be an issue with your Mic");
          // clean up;
          stop();
          stream.getTracks().forEach(function(track) {
            track.stop();
          });
          context.close();
        }
      }
      worker.postMessage({ command: 'record', buffers: getBuffers(event) });
      // we clone the samples
      leftchannel.push(new Float32Array(left));
      rightchannel.push(new Float32Array(right));
      recordingLength += bufferSize;
      // encoder.encode(getBuffers(e));
    };
    visualize();
  };

  function getBuffers(event) {
    var buffers = [];
    for (var ch = 0; ch < 2; ++ch)
      buffers[ch] = event.inputBuffer.getChannelData(ch);
    return buffers;
  }

  function start() {
    recording = true;
    document.querySelector('#msg').style.visibility = 'visible';
    // reset the buffers for the new recording
    leftchannel.length = rightchannel.length = 0;
    recordingLength = 0;
    console.log('context: ', !!context);
    if (!context) setUpRecording();
    // if (!encoder) {
    //   // Create the MP3 encoder
    //   encoder = new Mp3LameEncoder(context.sampleRate, 160);
    // }
    worker.postMessage({
      command: 'start',
      sampleRate: context.sampleRate,
      bitRate: 160
    });
    // recorder.onaudioprocess = function(event) {
    //   worker.postMessage({ command: 'record', buffers: getBuffers(event) });
    // };
  }

  function saveRecording(blob) {
    const audioUrl = URL.createObjectURL(blob);
    console.log('BLOB ', blob);
    console.log('URL ', audioUrl);
    document.querySelector('#audio').setAttribute('src', audioUrl);
    const link = document.querySelector('#download');
    link.setAttribute('href', audioUrl);
    link.download = 'output.mp3';
  }

  function stop() {
    console.log('Stop')
    recording = false;
    document.querySelector('#msg').style.visibility = 'hidden'

    // encoder from mp3-lame-encoder-js
    worker.postMessage({ command: 'finish' });
    // const blob = encoder.finish();
  }
  
  // Visualizer function from
  // https://webaudiodemos.appspot.com/AudioRecorder/index.html
  //
  function visualize() {
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    CENTERX = canvas.width / 2;
    CENTERY = canvas.height / 2;

    let visualSetting = visualSelect.value;
    console.log(visualSetting);
    if (!analyser) return;

    if(visualSetting === "sinewave") {
      analyser.fftSize = 2048;
      var bufferLength = analyser.fftSize;
      console.log(bufferLength);
      var dataArray = new Uint8Array(bufferLength);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      var draw = function() {

        drawVisual = requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {

          var v = dataArray[i] / 128.0;
          var y = v * HEIGHT/2;

          if(i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();
      };

      draw();

    } else if(visualSetting == "frequencybars") {
      analyser.fftSize = 64;
      var bufferLengthAlt = analyser.frequencyBinCount;
      console.log(bufferLengthAlt);
      var dataArrayAlt = new Uint8Array(bufferLengthAlt);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      var drawAlt = function() {
        drawVisual = requestAnimationFrame(drawAlt);

        analyser.getByteFrequencyData(dataArrayAlt);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        var barWidth = (WIDTH / bufferLengthAlt);
        var barHeight;
        var x = 0;

        for(var i = 0; i < bufferLengthAlt; i++) {
          barHeight = dataArrayAlt[i];

          canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
          canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

          x += barWidth + 1;
        }
      };

      drawAlt();

    } else if(visualSetting == "circle") {
      analyser.fftSize = 32;
      let bufferLength = analyser.frequencyBinCount;
      console.log(bufferLength);
      let dataArray = new Uint8Array(bufferLength);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      
      let draw = () => {
        drawVisual = requestAnimationFrame(draw);
        
        analyser.getByteFrequencyData(dataArray);
        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        
        // let radius = dataArray.reduce((a,b) => a + b) / bufferLength;
        let radius = dataArray[2] / 2
        if (radius < 20) radius = 20;
        if (radius > 100) radius = 100;
        // console.log('Radius ', radius)
        canvasCtx.beginPath();
        canvasCtx.arc(CENTERX, CENTERY, radius, 0, 2 * Math.PI, false);
        // canvasCtx.fillStyle = 'rgb(50,50,' + (radius+100) +')';
        // canvasCtx.fill();
        canvasCtx.lineWidth = 6;
        canvasCtx.strokeStyle = 'rgb(50,50,' + (radius+100) +')';
        canvasCtx.stroke();
      }
      draw()
    }

  }
  
  visualSelect.onchange = function() {
    window.cancelAnimationFrame(drawVisual);
    visualize();
  };
  
  micSelect.onchange = async e => {
    console.log('now use device ', micSelect.value);
    stream.getTracks().forEach(function(track) {
      track.stop();
    });
    context.close();
    
    stream = await getStream({ audio: {
      deviceId: {exact: micSelect.value} }, video: false });
    setUpRecording();
  }

  function pause() {
    recording = false;
    context.suspend()
  }

  function resume() {
    recording = true;
    context.resume();
  }

  document.querySelector('#record').onclick = (e) => {
    console.log('Start recording')
    start();
  };

  document.querySelector('#stop').onclick = (e) => {
    stop();
  };
})();