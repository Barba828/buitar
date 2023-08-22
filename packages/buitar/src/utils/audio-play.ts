import * as Tone from 'tone'
import { TonePlayer } from '@buitar/tone-player'

/**
 * 主动触发audioContext
 * 应绑定在用户操作事件上
 */
export const waitAudioContext = async () => {
    const player = (window.tonePlayer as TonePlayer)?.getContext()
    const originVolume = player.volume.value

    player.volume.value = -Infinity
    player?.triggerAttackRelease('A1', 0.01)
    player.volume.value = originVolume
    
    await Tone.start()
}