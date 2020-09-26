

export default function play(type) {
  var audio = document.createElement('audio');

  if (type === 'success') {
    audio.src = '/audio/completed.wav'
  } else if (type == 'delete') audio.src = '/audio/trash.mp3';
  else if (type == 'sent') audio.src = '/audio/sent.mp3';
  else if (type == 'like') audio.src = '/audio/like.mp3';
  else if (type == 'click') audio.src = '/audio/click.mp3';
  else if (type == 'notification') audio.src = '/audio/notification.wav';
  else {
    audio.src = '/audio/ui_loading.wav'
  }
  audio.play()
}

