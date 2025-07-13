
export interface BlockType {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  defaultContent: any;
  settings?: any;
}

export const BLOCK_CATEGORIES = {
  BASIC: {
    id: 'basic',
    name: 'Basic',
    icon: '📝'
  },
  CONTENT: {
    id: 'content',
    name: 'Content',
    icon: '📄'
  },
  MEDIA: {
    id: 'media',
    name: 'Media',
    icon: '🖼️'
  },
  LAYOUT: {
    id: 'layout',
    name: 'Layout',
    icon: '📐'
  },
  MARKETING: {
    id: 'marketing',
    name: 'Marketing',
    icon: '🎯'
  }
};

export const BLOCK_TYPES: BlockType[] = [
  // Basic Blocks
  {
    id: 'text',
    name: 'Text',
    category: 'basic',
    icon: '📝',
    description: 'Simple text paragraph',
    defaultContent: {
      text: 'Enter your text here...',
      fontSize: '16',
      fontWeight: 'normal',
      textAlign: 'left',
      color: '#000000'
    }
  },
  {
    id: 'heading',
    name: 'Heading',
    category: 'basic',
    icon: '📰',
    description: 'Title with subtitle',
    defaultContent: {
      title: 'Your Heading',
      subtitle: 'Your subtitle here',
      level: 'h1',
      textAlign: 'center',
      titleColor: '#000000',
      subtitleColor: '#666666'
    }
  },
  
  // Content Blocks
  {
    id: 'rich-text',
    name: 'Rich Text',
    category: 'content',
    icon: '📰',
    description: 'Formatted text with rich editing',
    defaultContent: {
      html: '<p>Rich text content goes here...</p>',
      backgroundColor: 'transparent',
      padding: '20'
    }
  },
  {
    id: 'quote',
    name: 'Quote',
    category: 'content',
    icon: '💬',
    description: 'Highlighted quote or testimonial',
    defaultContent: {
      quote: 'Your inspiring quote goes here...',
      author: 'Author Name',
      position: 'Position/Company',
      style: 'bordered',
      backgroundColor: '#f8f9fa'
    }
  },
  
  // Media Blocks
  {
    id: 'image',
    name: 'Image',
    category: 'media',
    icon: '🖼️',
    description: 'Image with caption',
    defaultContent: {
      src: '',
      alt: 'Image description',
      caption: '',
      width: '100%',
      alignment: 'center',
      borderRadius: '8'
    }
  },
  {
    id: 'video',
    name: 'Video',
    category: 'media',
    icon: '🎥',
    description: 'Embedded video player',
    defaultContent: {
      url: '',
      title: 'Video Title',
      autoplay: false,
      controls: true,
      width: '100%',
      aspectRatio: '16:9'
    }
  },
  
  // Layout Blocks
  {
    id: 'spacer',
    name: 'Spacer',
    category: 'layout',
    icon: '📏',
    description: 'Add spacing between elements',
    defaultContent: {
      height: '40',
      backgroundColor: 'transparent'
    }
  },
  {
    id: 'divider',
    name: 'Divider',
    category: 'layout',
    icon: '➖',
    description: 'Horizontal line separator',
    defaultContent: {
      style: 'solid',
      width: '100%',
      color: '#e0e0e0',
      thickness: '1'
    }
  },
  {
    id: 'columns',
    name: 'Columns',
    category: 'layout',
    icon: '📋',
    description: 'Multi-column layout',
    defaultContent: {
      columns: 2,
      gap: '20',
      content: [
        { text: 'Column 1 content' },
        { text: 'Column 2 content' }
      ]
    }
  },
  
  // Marketing Blocks
  {
    id: 'cta',
    name: 'Call to Action',
    category: 'marketing',
    icon: '🎯',
    description: 'Button with compelling message',
    defaultContent: {
      title: 'Ready to Get Started?',
      description: 'Take action now and transform your business',
      buttonText: 'Get Started',
      buttonUrl: '#',
      buttonStyle: 'primary',
      backgroundColor: '#f8f9fa',
      textAlign: 'center'
    }
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    category: 'marketing',
    icon: '📧',
    description: 'Simple contact form',
    defaultContent: {
      title: 'Get in Touch',
      fields: ['name', 'email', 'message'],
      buttonText: 'Send Message',
      successMessage: 'Thank you for your message!'
    }
  },
  {
    id: 'pricing',
    name: 'Pricing Card',
    category: 'marketing',
    icon: '💰',
    description: 'Pricing table or card',
    defaultContent: {
      title: 'Pro Plan',
      price: '$29',
      period: '/month',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      buttonText: 'Choose Plan',
      highlighted: false
    }
  }
];

export function getBlocksByCategory(categoryId: string): BlockType[] {
  return BLOCK_TYPES.filter(block => block.category === categoryId);
}

export function getBlockType(blockId: string): BlockType | undefined {
  return BLOCK_TYPES.find(block => block.id === blockId);
}
