// import React from 'react';
// import Link from 'next/link';
// import { ArrowRight, MessageSquare } from 'lucide-react'; // Assuming you use Lucide or similar icons

// interface WhatsAppWelcomeCardProps {
//     /** Main heading text */
//     title?: string;
//     /** Main description text */
//     description?: string;
//     /** Title for the inner action card */
//     actionTitle?: string;
//     /** Description for the inner action card */
//     actionDescription?: string;
//     /** Text to display on the button */
//     buttonText?: string;
//     /** URL for the button destination */
//     href?: string;
//     /** Optional custom class names */
//     className?: string;
// }

// const WhatsAppWelcomeCard: React.FC<WhatsAppWelcomeCardProps> = ({
//     title = "Welcome to the WhatsApp Business Platform",
//     description = "Send and receive messages to and from customers using cloud-based servers owned by Meta to host the WhatsApp Business API client.",
//     actionTitle = "Test the API",
//     actionDescription = "Send yourself test messages and view webhook events in real time.",
//     buttonText = "Start Testing",
//     href = "/api-testing",
//     className = "",
// }) => {
//     return (
//         <div
//             className={`
//                 w-full rounded-md p-6 sm:p-8
//                 shadow-xl backdrop-blur-sm
//                 bg-gradient-to-b from-[#2e2657f2] to-[#493e8199]
//                 text-white mb-8
//                 ${className}
//             `}
//         >
//             <div className="flex flex-col sm:flex-row gap-5 mb-8">
//                 <div className="flex-shrink-0">
//                     <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
//                         <MessageSquare className="w-6 h-6 text-green-400" />
//                     </div>
//                 </div>
//                 <div className="flex-1 space-y-2">
//                     <h2 className="text-2xl font-bold tracking-tight text-white">
//                         {title}
//                     </h2>
//                     <p className="text-slate-200 text-sm sm:text-base leading-relaxed opacity-90">
//                         {description}
//                     </p>
//                 </div>
//             </div>
//             <div className="relative overflow-hidden rounded-xl bg-black/20 border border-white/5 transition-all duration-300 hover:bg-black/30 hover:border-white/10 group">
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-6">
                
//                     <div className="space-y-1">
//                         <h3 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors">
//                             {actionTitle}
//                         </h3>
//                             <p className="text-sm text-slate-300">
//                             {actionDescription}
//                         </p>
//                     </div>

//                     <Link 
//                         href={href}
//                         className="
//                             flex-shrink-0 whitespace-nowrap
//                             inline-flex items-center gap-2
//                             px-5 py-2.5
//                             bg-white text-[#2e2657]
//                             rounded-lg font-semibold text-sm
//                             transition-all duration-200
//                             hover:bg-slate-100 hover:scale-105 active:scale-95
//                             shadow-lg shadow-black/20
//                         "
//                     >
//                         {buttonText}
//                         <ArrowRight className="w-4 h-4" />
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default WhatsAppWelcomeCard;




import React from 'react';
import Link from 'next/link';
import { ArrowRight, Info, Zap } from 'lucide-react';

interface WhatsAppWelcomeCardProps {
    title?: string;
    description?: string;
    buttonText?: string;
    href?: string;
    className?: string;
}

const WhatsAppWelcomeCard: React.FC<WhatsAppWelcomeCardProps> = ({
    title = "Service Connector",
    description = "Exchange customer messages through Meta-owned cloud servers hosting the WhatsApp Business API.",
    buttonText = "API Setup",
    href = "/generate-token",
    className = "",
}) => {
    return (
        <div
            className={`
                group relative w-full overflow-hidden rounded-xl
                bg-[#2e2657]/5 border border-[#2e2657]/10
                transition-all duration-300 mb-8
                ${className}
            `}
        >
            <div className="relative p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Left Side: Icon & Text */}
                <div className="flex gap-4 items-start sm:items-center">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-[#2e2657]/10 flex items-center justify-center text-color-primary">
                            <Info className="w-5 h-5" />
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-color-primary">
                            {title}
                        </h3>
                        <p className="text-sm text-color-primary-light font-normal leading-snug max-w-2xl">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Right Side: Action Button */}
                <Link 
                    href={href}
                    className="
                        group/btn
                        flex-shrink-0 whitespace-nowrap
                        inline-flex items-center justify-center gap-2
                        px-5 py-2
                        bg-white text-color-primary
                        border border-color-primary
                        rounded-lg font-semibold text-xs sm:text-sm
                        transition-all duration-300 ease-out
                        active:scale-95
                        ml-auto sm:ml-0
                    "
                >
                    <Zap className="w-3.5 h-3.5 fill-color-primary/20" />
                    {buttonText}
                    <ArrowRight className="w-3.5 h-3.5 opacity-70 transition-transform duration-300 group-hover/btn:translate-x-1 text-color-primary!" />
                </Link>
            </div>
        </div>
    );
};

export default WhatsAppWelcomeCard;