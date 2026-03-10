import React, { useRef, useEffect, useState } from 'react';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import '../styles/Preview.css';

const TEMPLATES = {
    professional: ProfessionalTemplate,
    modern: ModernTemplate,
    creative: CreativeTemplate,
};

// A4 width in px at 96dpi
const A4_PX = 794;

export default function Preview({ resumeData, template, printRef }) {
    const TemplateComponent = TEMPLATES[template] || TEMPLATES.professional;
    const wrapperRef = useRef();
    const [scale, setScale] = useState(0.52);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const obs = new ResizeObserver(([entry]) => {
            const available = entry.contentRect.width - 32;
            setScale(parseFloat(Math.min(available / A4_PX, 1).toFixed(3)));
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // A4 height in px ~1123; collapse the extra space below scaled content
    const A4_H = 1123;

    return (
        <div className="preview-wrapper" ref={wrapperRef}>
            <div
                style={{
                    transformOrigin: 'top center',
                    transform: `scale(${scale})`,
                    width: A4_PX,
                    marginBottom: -(A4_H * (1 - scale)),
                    flexShrink: 0,
                }}
            >
                <div className="preview-paper" ref={printRef}>
                    <TemplateComponent data={resumeData} />
                </div>
            </div>
        </div>
    );
}
