import app from '~/app.vue'
import { describe, it, expect } from 'vitest'
import { mountSuspended } from 'nuxt-vitest/utils'

describe('app', () => {
  it('app can be mounted', async () => {
    const component = await mountSuspended(app, { route: '/' })
    expect(component).toBeTruthy()
  })
  it('app has Discord Timestamp Generator text', async () => {
    const component = await mountSuspended(app, { route: '/' })
    expect(component.html()).toContain('Discord Timestamp Generator')
  })
})
