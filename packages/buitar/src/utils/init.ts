import * as ToGuitar from '@buitar/to-guitar'
import * as Tone from 'tone'
import { TonePlayer, DrumPlayer } from '@buitar/tone-player'
import { baseUrl } from '@/pages/router'

window.Tone = Tone
window.ToGuitar = ToGuitar

// 初始化baseUrl
TonePlayer.setBaseUrl(`${baseUrl}assets/samples/`)
/**
 * 吉他播放器
 */
const player = new TonePlayer('guitar-acoustic')
window.tonePlayer = player
/**
 * 鼓机播放器
 */
const drumPlayer = new DrumPlayer('drum')
window.drumPlayer = drumPlayer



