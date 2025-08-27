import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    return (
        <div className="prose max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    h1: ({ children }) => (
                        <h1 className="text-3xl font-bold text-gray-900 mb-6 py-4">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{children}</h3>
                    ),
                    p: ({ children }) => (
                        <p className="text-gray-700 leading-relaxed mb-6">{children}</p>
                    ),
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-2">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="mb-1">{children}</li>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="bg-gray-50 border-l-4 border-green-500 p-6 mb-6 text-gray-700 italic">
                            {children}
                        </blockquote>
                    ),
                    code: ({ children, ...props }) => {
                        const inline = !props.className?.includes('language-');
                        if (inline) {
                            return (
                                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
                                <code>{children}</code>
                            </pre>
                        );
                    },
                    img: ({ src, alt }) => (
                        <img
                            src={src}
                            alt={alt || 'Image'}
                            className="w-full h-64 md:h-80 object-cover rounded-lg mb-8"
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;