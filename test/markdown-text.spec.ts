import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import MarkdownText from '@/components/renderers/MarkdownText.vue';

describe('MarkdownText', () => {
  it('renders markdown and sanitizes html', () => {
    const wrapper = mount(MarkdownText, {
      props: {
        content: '# Title <script>alert(1)</script>'
      }
    });

    expect(wrapper.html()).toContain('<h1>Title ');
    expect(wrapper.html()).not.toContain('<script>');
  });
});
