"use client"

import React, { useEffect } from 'react';

export default function Chatbot() {
  useEffect(() => {
    // Initialize OpenWidget configuration
    window.__ow = window.__ow || {};
    window.__ow.organizationId = "9fc35d20-b74b-4ed0-a3df-a4071a9d7261";
    window.__ow.template_id = "5fe6b861-8b0a-4b14-8133-ebc6826ac945";
    window.__ow.integration_name = "manual_settings";
    window.__ow.product_name = "chatbot";   

    // Load OpenWidget script
    const loadScript = () => {
      const script = document.createElement('script');
      script.async = true;
      script.type = 'text/javascript';
      script.src = 'https://cdn.openwidget.com/openwidget.js';
      document.head.appendChild(script);

      // Cleanup function to remove script on component unmount
      return () => {
        document.head.removeChild(script);
        // Cleanup any OpenWidget related elements if needed
        const widget = document.getElementById('openwidget');
        if (widget) {
          widget.remove();
        }
      };
    };

    // Only initialize if not already initialized
    if (!window.OpenWidget) {
      loadScript();
    }

    // Cleanup function
    return () => {
      // Additional cleanup if needed when component unmounts
      delete window.__ow;
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // The chatbot widget will be injected by the OpenWidget script
  return null; // No need to render anything in the component
}