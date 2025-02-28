
import React from 'react';
import { renderHTML, getContentSummary } from '@/lib/textContent';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface KarmicNumberCardProps {
  title: string;
  number: number;
  content: string;
  isExpanded: boolean;
  onToggle: () => void;
  delay?: number;
}

const KarmicNumberCard: React.FC<KarmicNumberCardProps> = ({ 
  title, 
  number, 
  content, 
  isExpanded, 
  onToggle,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.15 }}
      className="karmic-card mb-6 cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="karmic-title">{title}</h3>
        <div className="flex items-center space-x-2">
          <span className="karmic-number">{number}</span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-karmic-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-karmic-500" />
          )}
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : '80px' }}
        className="overflow-hidden"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isExpanded ? (
          <div 
            className="karmic-content" 
            dangerouslySetInnerHTML={renderHTML(content)} 
          />
        ) : (
          <p className="karmic-content">
            {getContentSummary(content)}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default KarmicNumberCard;
