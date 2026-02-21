(function () {
  'use strict';

  function getVideo() {
    return document.querySelector('video');
  }

  function seek(seconds) {
    const video = getVideo();
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration || Infinity, video.currentTime + seconds));
  }

  function showNudge(seconds) {
    const existing = document.getElementById('yt-seeker-nudge');
    if (existing) existing.remove();

    const nudge = document.createElement('div');
    nudge.id = 'yt-seeker-nudge';
    nudge.textContent = (seconds > 0 ? '+' : '') + seconds + 's';
    nudge.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.75);
      color: #fff;
      font-size: 22px;
      font-family: sans-serif;
      padding: 8px 20px;
      border-radius: 8px;
      z-index: 99999;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(nudge);
    setTimeout(() => {
      nudge.style.opacity = '0';
      setTimeout(() => nudge.remove(), 300);
    }, 700);
  }

  document.addEventListener('keydown', function (e) {
    // Only act when a video is present and user isn't typing in an input
    const tag = document.activeElement && document.activeElement.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || document.activeElement.isContentEditable) return;

    const video = getVideo();
    if (!video) return;

    let delta = null;

    if (e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
      if (e.key === 'ArrowRight') delta = 1;
      else if (e.key === 'ArrowLeft') delta = -1;
    } else if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      if (e.key === 'ArrowRight') delta = 3;
      else if (e.key === 'ArrowLeft') delta = -3;
    }

    if (delta !== null) {
      e.preventDefault();
      e.stopImmediatePropagation();
      seek(delta);
      showNudge(delta);
    }
  }, true);

})();
