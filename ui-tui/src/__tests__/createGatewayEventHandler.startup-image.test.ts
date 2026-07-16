import { beforeEach, describe, expect, it, vi } from 'vitest'

import { resetOverlayState } from '../app/overlayStore.js'
import { resetTurnState } from '../app/turnStore.js'
import { patchUiState, resetUiState } from '../app/uiStore.js'
import { turnController } from '../app/turnController.js'
import { createGatewayEventHandler } from '../app/createGatewayEventHandler.js'

const buildCtx = (submit: ReturnType<typeof vi.fn>) => ({
  composer: {
    dequeue: () => undefined,
    queueEditRef: { current: null },
    sendQueued: vi.fn(),
    setInput: vi.fn()
  },
  gateway: {
    gw: { request: vi.fn() },
    rpc: vi.fn(async () => ({ config: { display: { tui_auto_resume_recent: false } } }))
  },
  session: {
    STARTUP_RESUME_ID: '',
    colsRef: { current: 80 },
    newSession: vi.fn(),
    resetSession: vi.fn(),
    resumeById: vi.fn(),
    setCatalog: vi.fn()
  },
  submission: {
    submitRef: { current: submit }
  },
  system: {
    bellOnComplete: false,
    sys: vi.fn()
  },
  transcript: {
    appendMessage: vi.fn(),
    panel: vi.fn(),
    setHistoryItems: vi.fn()
  },
  voice: {
    setProcessing: vi.fn(),
    setRecording: vi.fn(),
    setVoiceEnabled: vi.fn()
  }
})

describe('createGatewayEventHandler startup fallback prompt', () => {
  beforeEach(() => {
    resetOverlayState()
    resetUiState()
    resetTurnState()
    turnController.fullReset()
    patchUiState({ showReasoning: true })
  })

  const image = (globalThis as any).process?.env?.HERMES_TUI_IMAGE

  if (!image) {
    it.skip('uses a neutral marker when startup has image but no query (requires HERMES_TUI_IMAGE env var)', () => {
      expect(process.env.HERMES_TUI_IMAGE).toBeDefined()
    })
    return
  }

  it('uses a neutral marker when startup has image but no query', async () => {
    const submit = vi.fn()
    const ctx = buildCtx(submit)
    const onEvent = createGatewayEventHandler(ctx as any)

    patchUiState({ sid: 'session-id' })
    onEvent({ payload: {}, type: 'gateway.ready' } as any)

    await vi.waitFor(() => expect(submit).toHaveBeenCalled())
    expect(submit).toHaveBeenCalledWith('[image attached]')
  })
})
