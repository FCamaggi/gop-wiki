import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '../../../common/Button';
import { Card } from '../../../common/Card';
import useMediaQuery from '../../../../hooks/common/useMediaQuery';

export default function PDFViewer({ url }) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const controls = [
    {
      icon: <ZoomOut size={20} />,
      action: () => setScale((prev) => Math.max(prev - 0.2, 0.5)),
      label: 'Reducir zoom',
    },
    {
      icon: <ZoomIn size={20} />,
      action: () => setScale((prev) => Math.min(prev + 0.2, 2)),
      label: 'Aumentar zoom',
    },
    {
      icon: <RotateCw size={20} />,
      action: () => setRotation((prev) => (prev + 90) % 360),
      label: 'Rotar PDF',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      <Card className="flex justify-center gap-2 p-2">
        {controls.map(({ icon, action, label }) => (
          <Button
            key={label}
            variant="ghost"
            onClick={action}
            aria-label={label}
            className="p-2 hover:bg-slate-100 rounded-md"
          >
            {icon}
          </Button>
        ))}
      </Card>

      <Card className="w-full overflow-hidden">
        <div
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease',
          }}
          className="w-full"
        >
          <iframe
            src={`${url}#toolbar=0`}
            className="w-full border-0"
            style={{
              height: isMobile ? '400px' : '600px',
            }}
            title="PDF Viewer"
          />
        </div>
      </Card>
    </div>
  );
}
