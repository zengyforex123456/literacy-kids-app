import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from '../settingsStore'

describe('settingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      dailyLimitMinutes: 30, difficulty: 1, eyeCare: true,
      reminder: false, reminderTime: '18:00', music: true, parentPin: '1234',
    })
  })

  it('should set difficulty', () => {
    useSettingsStore.getState().setDifficulty(3)
    expect(useSettingsStore.getState().difficulty).toBe(3)
  })

  it('should set daily limit', () => {
    useSettingsStore.getState().setDailyLimit(45)
    expect(useSettingsStore.getState().dailyLimitMinutes).toBe(45)
  })

  it('should toggle eye care', () => {
    expect(useSettingsStore.getState().eyeCare).toBe(true)
    useSettingsStore.getState().toggleEyeCare()
    expect(useSettingsStore.getState().eyeCare).toBe(false)
  })

  it('should toggle reminder', () => {
    useSettingsStore.getState().toggleReminder()
    expect(useSettingsStore.getState().reminder).toBe(true)
  })

  it('should toggle music', () => {
    useSettingsStore.getState().toggleMusic()
    expect(useSettingsStore.getState().music).toBe(false)
  })

  it('should set reminder time', () => {
    useSettingsStore.getState().setReminderTime('20:00')
    expect(useSettingsStore.getState().reminderTime).toBe('20:00')
  })
})
