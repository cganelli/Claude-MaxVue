import React from 'react';
import { Mail, Reply, Forward, Archive } from 'lucide-react';
import VisionCorrectedContent from './VisionCorrectedContent';

interface EmailViewerProps {
  className?: string;
}

const EmailViewer: React.FC<EmailViewerProps> = ({ className = '' }) => {
  const sampleEmail = {
    from: 'john.doe@example.com',
    subject: 'Important Meeting Update',
    date: 'Today, 2:30 PM',
    content: `Hi there,

I wanted to update you on tomorrow's meeting. We've moved the location to Conference Room B on the 3rd floor.

The agenda remains the same:
• Project status review
• Budget discussion
• Next quarter planning

Please let me know if you have any questions.

Best regards,
John`
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Email Header */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <Mail className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-900">Email</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-900">{sampleEmail.subject}</p>
              <p className="text-sm text-gray-600">From: {sampleEmail.from}</p>
            </div>
            <span className="text-xs text-gray-500">{sampleEmail.date}</span>
          </div>
        </div>
      </div>

      {/* Email Content with Vision Correction */}
      <VisionCorrectedContent className="p-6">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-line text-gray-800 leading-relaxed">
            {sampleEmail.content}
          </div>
        </div>
      </VisionCorrectedContent>

      {/* Email Actions */}
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Reply className="h-4 w-4" />
            <span>Reply</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            <Forward className="h-4 w-4" />
            <span>Forward</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            <Archive className="h-4 w-4" />
            <span>Archive</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailViewer;