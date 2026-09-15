const BrainGrowthSounds = (function () {
  const SAMPLE_RATE = 22050;
  const urls = {};
  let current = null;

  function pcmToWav(samples) {
    const dataSize = samples.length * 2;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    function str(offset, text) {
      for (let i = 0; i < text.length; i += 1) {
        view.setUint8(offset + i, text.charCodeAt(i));
      }
    }
    str(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    str(8, "WAVE");
    str(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, SAMPLE_RATE, true);
    view.setUint32(28, SAMPLE_RATE * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    str(36, "data");
    view.setUint32(40, dataSize, true);
    let offset = 44;
    for (let i = 0; i < samples.length; i += 1, offset += 2) {
      const value = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, value < 0 ? value * 0x8000 : value * 0x7fff, true);
    }
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return "data:audio/wav;base64," + btoa(binary);
  }

  function mix(notes, total) {
    const length = Math.ceil(total * SAMPLE_RATE);
    const samples = new Float32Array(length);
    for (let n = 0; n < notes.length; n += 1) {
      const note = notes[n];
      const start = Math.floor(note.at * SAMPLE_RATE);
      const count = Math.floor(note.dur * SAMPLE_RATE);
      for (let i = 0; i < count && start + i < length; i += 1) {
        const t = i / SAMPLE_RATE;
        const fadeIn = Math.min(1, t / 0.012);
        const fadeOut = Math.max(0, 1 - t / note.dur);
        samples[start + i] +=
          Math.sin(2 * Math.PI * note.freq * t) * note.vol * fadeIn * fadeOut;
      }
    }
    return pcmToWav(samples);
  }

  const recipes = {
    start: function () {
      return mix(
        [
          { freq: 523.25, at: 0, dur: 0.2, vol: 0.45 },
          { freq: 659.25, at: 0.12, dur: 0.22, vol: 0.5 },
          { freq: 783.99, at: 0.26, dur: 0.38, vol: 0.55 },
        ],
        0.7,
      );
    },
    drift: function () {
      return mix(
        [
          { freq: 440, at: 0, dur: 0.34, vol: 0.42 },
          { freq: 523.25, at: 0, dur: 0.34, vol: 0.38 },
          { freq: 440, at: 0.5, dur: 0.34, vol: 0.42 },
          { freq: 523.25, at: 0.5, dur: 0.34, vol: 0.38 },
        ],
        0.95,
      );
    },
    end: function () {
      return mix(
        [
          { freq: 523.25, at: 0, dur: 0.22, vol: 0.4 },
          { freq: 659.25, at: 0.14, dur: 0.22, vol: 0.45 },
          { freq: 783.99, at: 0.28, dur: 0.24, vol: 0.5 },
          { freq: 1046.5, at: 0.46, dur: 0.58, vol: 0.55 },
        ],
        1.1,
      );
    },
  };

  function url(name) {
    if (!urls[name] && recipes[name]) {
      urls[name] = recipes[name]();
    }
    return urls[name] || "";
  }

  function play(name) {
    const src = url(name);
    if (!src) {
      return Promise.resolve();
    }
    if (current) {
      current.pause();
    }
    const el = new Audio(src);
    el.volume = 1;
    current = el;
    const result = el.play();
    return result && result.catch
      ? result.catch(function (error) {
          console.info("[BrainGrowth] Could not play chime", error);
          throw error;
        })
      : Promise.resolve();
  }

  return { play: play, url: url };
})();

if (typeof window !== "undefined") {
  window.BrainGrowthSounds = BrainGrowthSounds;
}
