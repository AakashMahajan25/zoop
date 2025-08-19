import React from 'react';
import CheckIcon from '@mui/icons-material/Check';

export interface StepItem {
  id: string;
  title: string;
  date?: string;
  author?: string;
  documents?: string[];
  showActions?: boolean;
  hasDocuments: boolean;
  hasClaimsDetails: boolean;
  hasDischargeCopyPreview?: boolean;
  status?: 'pending' | 'completed';
}

interface CompletedVerticalStepperProps {
  steps: StepItem[];
  onViewDocuments?: (stepId: string) => void;
  onViewClaims?: (stepId: string) => void;
  onViewDischargeCopy?: (stepId: string) => void;
}

const CompletedVerticalStepper: React.FC<CompletedVerticalStepperProps> = ({ steps,  onViewDocuments, onViewClaims, onViewDischargeCopy}) => (
  <div style={{ position: 'relative', paddingLeft: 40 }}>
    {steps.map((step, index) => {

          // Circle style: filled green with check
      const circleStyle: React.CSSProperties = {
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
                background: 'var(--Grey-Pallette-Grey-800, #27272A)',
        border: '1.07px solid #1A8450',
        boxShadow: '0px 0px 6px 0px #21FF9199',
        color: '#FFFFFF'
      };

      // Connector style
      const connectorStyle: React.CSSProperties = {
        position: 'absolute',
        top: 40,
        left: 20,
        width: 0,
        height: `calc(100% - 32px + 30px)`,  // touch circles
        borderLeft: '1.5px solid #000000',
      };

      return (
        <div key={step.id} style={{ display: 'flex', position: 'relative', marginBottom: 40 }}>
                    <div style={circleStyle}>
            <CheckIcon sx={{ fontSize: 24, color: '#21FF91' }} />
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && <div style={connectorStyle} />}

          {/* Content area */}
          <div style={{ marginLeft: 16, flex: 1 }}>
            <div className="flex justify-between items-center">
              <p className="text-[18px] text-[#4B465C] m-0">{step.title}</p>
                <div className="flex gap-2">
                  {step.hasDocuments && onViewDocuments &&(
                    <button className=" cursor-pointer border border-black px-2 py-1 rounded radius-[6px] text-[14px]"
                     onClick={() => onViewDocuments(step.id)}
                                          >
                      View Documents
                    </button>
                  )}
                  {step.hasClaimsDetails && onViewClaims && (
                    <button className="cursor-pointer border border-black px-2 py-1 rounded radius-[6px] text-[14px]"
                    onClick={() => onViewClaims(step.id)}>
                      View Claim Details
                    </button>
                  )}
                  {step.hasDischargeCopyPreview && onViewDischargeCopy && (
                    <button
                      className="cursor-pointer border border-black px-2 py-1 rounded radius-[6px] text-[14px]"
                      onClick={() => onViewDischargeCopy(step.id)}
                    >
                      View Documents
                    </button>
                  )}
                </div>
            </div>

            {(step.date || step.author) && (
              <p className="text-[#4B465C] text-[14px] mt-1 mb-2">
                {step.date}
                {step.date && step.author ? ' | ' : ''}
                {step.author}
              </p>
            )}

            {step.documents && (
              <div className="flex gap-2 mt-6 flex-wrap radius-[4.55px]">
                {step.documents.map((doc) => (
                  <span
                    key={doc}
                    className="text-[10px] bg-[#0AA7DC0A] border border-[#0AA7DC] text-[#0AA7DC] px-3 py-1 rounded-md text-sm flex items-center gap-1 hover:cursor-pointer"
                  >
                    <img src="/assets/pdfIcon.svg" alt="pdfIcon" className="w-[10.62px] h-[10.62px]" />
                    {doc}
                  </span>
                ))}
              </div>
            )}

            {step.status === 'pending' && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[#FF9F43] text-[16px]">● Pending</span>
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

export default CompletedVerticalStepper;
