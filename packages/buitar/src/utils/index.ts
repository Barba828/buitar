import * as ToGuitar from '@buitar/to-guitar'
import * as Tone from 'tone'
import { TonePlayer } from '@buitar/tone-player'
import { baseUrl } from '@/pages/router'

window.Tone = Tone
window.ToGuitar = ToGuitar

TonePlayer.setBaseUrl(`${baseUrl}assets/samples/`)
/**
 * 吉他播放器
 */
const player = new TonePlayer('guitar-acoustic')
window.tonePlayer = player

