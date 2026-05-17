let SoundLib: any = null;
let bgm: any = null;

try {
  // react-native-sound exposes a default export in some setups
  // try both common forms to be robust
  const mod = require('react-native-sound');
  SoundLib = mod && (mod.default || mod);
} catch {
  SoundLib = null;
}

const BUNDLE_ASSET = '../../assets/mvett.mp3';

export async function startBgm() {
  if (!SoundLib) return;
  try {
    if (bgm) return;
    SoundLib.setCategory && SoundLib.setCategory('Playback');
    // require the bundled asset; user must add the file at assets/mvett.mp3
    // This is wrapped in try/catch because require will fail if file missing.
    const asset = require(BUNDLE_ASSET);
    bgm = new SoundLib(asset, SoundLib.MAIN_BUNDLE, (err: any) => {
      if (err) {
        console.warn('BGM load failed', err);
        bgm = null;
        return;
      }
      try {
        bgm.setNumberOfLoops(-1);
        bgm.setVolume(0.8);
        bgm.play(() => {
          // loop handled by setNumberOfLoops
        });
      } catch {
        // ignore
      }
    });
  } catch {
    // no-op if anything fails (missing native lib or asset)
    bgm = null;
  }
}

export function stopBgm() {
  if (!bgm) return;
  try {
    bgm.stop(() => {
      try {
        bgm.release && bgm.release();
      } catch {}
      bgm = null;
    });
  } catch {
    bgm = null;
  }
}

export function isAvailable() {
  return !!SoundLib;
}
