import { shallowMount } from '@vue/test-utils';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount({}, {
      propsData: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
