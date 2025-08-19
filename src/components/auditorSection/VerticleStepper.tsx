import { colorSchemeDarkBlue } from 'ag-grid-community';
import React from 'react';

export interface StepItem {
  id: number;
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

interface VerticalStepperProps {
  steps: StepItem[];
  currentStep: number;
onViewDocuments?: (stepId: number) => void;
  onViewClaims?: (stepId: number) => void;
  onViewDischargeCopy?: (stepId: number) => void;
}

const VerticalStepper: React.FC<VerticalStepperProps> = ({ steps, currentStep,  onViewDocuments, onViewClaims, onViewDischargeCopy}) => (
  <div style={{ position: 'relative', paddingLeft: 40 }}>
    {steps.map((step, index) => {
      const isCompleted = step.id < currentStep;
      const isActive = step.id === currentStep;

      // Text style for circle content
      const textStyle = isCompleted || isActive
        ? {
            fontFamily: 'Geist',
            fontWeight: 500,
            fontSize: '20px',
            lineHeight: '29.33px',
            letterSpacing: '0px',
            textAlign: 'center' as const,
            verticalAlign: 'middle' as const,
            backgroundImage: 'linear-gradient(0deg, #4B465C, #4B465C), linear-gradient(0deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }
        : {
            fontFamily: 'Geist',
            fontWeight: 400,
            fontSize: '20px',
            lineHeight: '29.33px',
            letterSpacing: '0px',
            textAlign: 'center' as const,
            verticalAlign: 'middle' as const,
            color: '#C2C2C2',
            border: '1.33px solid #E5E5E5'
          };

      // Circle style
      const circleStyle: React.CSSProperties = {
        width: 40,
        height: 40,
        borderRadius: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1.33px solid #000000',
        boxShadow: isCompleted || isActive ? '0px 0px 4.4px 0px #00FF83' : undefined,
        backgroundColor: '#FFFFFF',
        ...textStyle,
      };

      // Connector style (extend into margin-bottom)
      const connectorStyle: React.CSSProperties = {
        position: 'absolute',
        top: 40,
        left: 20,
        width: 0,
        height: `calc(100% - 32px + 30px)`,
        borderLeft: isCompleted
          ? '1.5px solid #000000'
          : '1px solid #E5E5E5',
      };

      return (
        <div key={step.id} style={{ display: 'flex', position: 'relative', marginBottom: 40 }}>
          <div style={circleStyle}>{step.id}</div>

          {/* Connector line */}
          {index < steps.length - 1 && <div style={connectorStyle} />}

          {/* Content area */}
          <div style={{ marginLeft: 16, flex: 1 }}>
            <div className="flex justify-between items-center">
              <p className="text-[18px] text-[#4B465C] m-0">{step.title}</p>
              {step.showActions && (
                <div className="flex gap-2">
                  {step.hasDocuments && onViewDocuments &&(
                    <button className="cursor-pointer border border-black px-2 py-1 rounded radius-[6px] text-[14px]"
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
                      className=" cursor-pointer border border-black px-2 py-1 rounded radius-[6px] text-[14px]"
                      onClick={() => onViewDischargeCopy(step.id)}
                    >
                      View Discharge Copy
                    </button>
                  )}
                </div>
              )}
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

export default VerticalStepper;
