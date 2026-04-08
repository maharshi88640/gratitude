import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Heart, Shield, Users, Book, AlertTriangle, X, ExternalLink } from 'lucide-react';

interface CrisisSupportProps {
  onClose: () => void;
}

const CrisisSupport: React.FC<CrisisSupportProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'emergency' | 'resources' | 'planning' | 'help'>('emergency');

  const emergencyContacts = [
    { name: 'Tele-MANAS (Govt of India)', number: '14416', available: '24/7', type: 'hotline', website: 'https://telemanas.mohfw.gov.in/home' },
    { name: 'Vandrevala Foundation', number: '9999666555', available: '24/7', type: 'hotline', website: 'https://www.vandrevalafoundation.com/' },
    { name: 'iCall - TISS Helpline', number: '9152987821', available: 'Mon-Sat 8AM-10PM', type: 'hotline', website: 'https://icallhelpline.org/' },
    { name: 'Mpower Minds Helpline', number: '1800-120-820050', available: '24/7', type: 'hotline', website: 'https://mpowerminds.com/oneonone' },
    { name: 'Aasra Suicide Prevention', number: '02227546669', available: '24/7', type: 'hotline', website: 'https://www.aasra.info/helpline.html' },
    { name: 'Snehi Suicide Prevention', number: '91-9820466726', available: '24/7', type: 'hotline', website: 'https://www.snehi.org/' },
    { name: 'Sumaitri Delhi', number: '011-23389090', available: '24/7', type: 'hotline', website: 'https://www.sumaitri.com/' },
    { name: 'Connecting Mumbai', number: '91-9922004309', available: '24/7', type: 'hotline', website: 'https://www.connectingngoindia.org/' },
  ];

  const resources = [
    {
      title: 'Premier Mental Health Institutes',
      items: [
        { name: 'NIMHANS Bangalore', website: 'https://www.nimhans.ac.in/' },
        { name: 'The Live Love Laugh Foundation', website: 'https://www.thelivelovelaughfoundation.org/' },
        { name: 'YourDOST Online Counseling', website: 'https://i.yourdost.com/' },
        { name: 'InnerHour Mental Health', website: 'https://www.theinnerhour.com/' },
        { name: 'Mpower Minds', website: 'https://mpowerminds.com/' },
      ]
    },
    {
      title: 'Government Mental Health Services',
      items: [
        { name: 'Tele-MANAS National Helpline', website: 'https://telemanas.mohfw.gov.in/home' },
        { name: 'National Mental Health Programme', website: 'https://www.mohfw.gov.in/' },
        { name: 'Ayushman Bharat Mental Health', website: 'https://www.pmjay.gov.in/' },
        { name: 'District Mental Health Programme', website: 'https://www.mohfw.gov.in/' },
        { name: 'Psychiatric Hospitals Directory', website: 'https://www.nimhans.ac.in/' },
      ]
    },
    {
      title: 'NGO Mental Health Support',
      items: [
        { name: 'Vandrevala Foundation', website: 'https://www.vandrevalafoundation.com/' },
        { name: 'iCall - TISS Helpline', website: 'https://icallhelpline.org/' },
        { name: 'Aasra Suicide Prevention', website: 'https://www.aasra.info/' },
        { name: 'Snehi NGO', website: 'https://www.snehi.org/' },
        { name: 'Sumaitri Delhi', website: 'https://www.sumaitri.com/' },
      ]
    },
    {
      title: 'Digital Mental Health Platforms',
      items: [
        { name: 'Wysa AI Mental Health', website: 'https://www.wysa.io/' },
        { name: 'Mindhouse Therapy', website: 'https://www.mindhouse.in/' },
        { name: 'Mann Talks India', website: 'https://www.manntalks.org/' },
        { name: 'The Mind Clan', website: 'https://themindclan.com/' },
        { name: 'BetterLYF Wellness', website: 'https://www.betterlyf.com/' },
      ]
    },
  ];

  const safetyPlanSteps = [
    {
      title: 'Warning Signs',
      description: 'Identify your personal warning signs',
      placeholder: 'What thoughts, feelings, or behaviors signal you need help?',
    },
    {
      title: 'Coping Strategies',
      description: 'List activities that help you feel better',
      placeholder: 'What can you do on your own to manage difficult feelings?',
    },
    {
      title: 'Support People',
      description: 'People who can help during a crisis',
      placeholder: 'Who can you call for support?',
    },
    {
      title: 'Professional Help',
      description: 'Contact information for professionals',
      placeholder: 'Therapists, doctors, or counselors to contact',
    },
    {
      title: 'Safe Environment',
      description: 'Places where you feel safe and calm',
      placeholder: 'Where can you go to feel safe?',
    },
  ];

  const handleEmergencyCall = (number: string) => {
    if (number.startsWith('Text')) {
      // For text lines, open messages app
      window.open('sms:741741', '_blank');
    } else {
      window.open(`tel:${number}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 sm:p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Mental Health Support</h2>
              <p className="text-white/90">You're not alone. Help is available 24/7.</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
            { id: 'resources', label: 'Resources', icon: Book },
            { id: 'planning', label: 'Safety Plan', icon: Shield },
            { id: 'help', label: 'Find Help', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900">If you're in immediate danger</h3>
                    <p className="text-red-700 text-sm mt-1">Call 911 or go to the nearest emergency room.</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{contact.available}</p>
                        {contact.website && (
                          <a
                            href={contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm mt-2"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Visit Website</span>
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => handleEmergencyCall(contact.number)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        {contact.type === 'text' ? (
                          <MessageCircle className="w-4 h-4" />
                        ) : (
                          <Phone className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          {contact.type === 'text' ? 'Text' : 'Call'}
                        </span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 mt-2 font-medium">{contact.number}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="text-center">
                <Heart className="w-12 h-12 text-pink-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Mental Health Resources</h3>
                <p className="text-gray-600 text-sm mt-1">Educational content to support your wellness journey</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {resources.map((category, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">{category.title}</h4>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-1.5 flex-shrink-0" />
                          {typeof item === 'object' && item.website ? (
                            <a
                              href={item.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                            >
                              <span>{item.name}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-sm text-gray-700">{item}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'planning' && (
            <div className="space-y-6">
              <div className="text-center">
                <Shield className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Create Your Safety Plan</h3>
                <p className="text-gray-600 text-sm mt-1">A personalized plan for difficult moments</p>
              </div>

              <div className="space-y-4">
                {safetyPlanSteps.map((step, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{step.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        <textarea
                          placeholder={step.placeholder}
                          className="w-full mt-2 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Save Safety Plan
              </button>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-6">
              <div className="text-center">
                <Users className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Find Professional Help</h3>
                <p className="text-gray-600 text-sm mt-1">Connect with mental health professionals</p>
              </div>

              <div className="grid gap-4">
                {[
                  { 
                    title: 'NIMHANS Bangalore', 
                    description: 'Premier mental health institute', 
                    icon: '🏥',
                    url: 'https://nimhans.ac.in/',
                    phone: '+91-80-26995000'
                  },
                  { 
                    title: 'Tata Institute - iCall', 
                    description: 'Free online counseling service', 
                    icon: '📞',
                    url: 'https://icall.tiss.edu/',
                    phone: '+91-9152987821'
                  },
                  { 
                    title: 'YourDOST Platform', 
                    description: 'Online therapy with Indian psychologists', 
                    icon: '💙',
                    url: 'https://www.yourdost.com/',
                    phone: '+91-9206952955'
                  },
                  { 
                    title: 'The Live Love Laugh Foundation', 
                    description: 'Mental health support network', 
                    icon: '❤️',
                    url: 'https://thelivelovelaughfoundation.org/',
                    phone: '+91-9152987821'
                  },
                  { 
                    title: 'InnerHour Mental Health', 
                    description: 'Evidence-based therapy programs', 
                    icon: '🧠',
                    url: 'https://www.innerhour.com/',
                    phone: '+91-9152987821'
                  },
                  { 
                    title: 'Government Mental Hospitals', 
                    description: 'State-run psychiatric facilities', 
                    icon: '🏛️',
                    url: 'https://www.mohfw.gov.in/',
                    phone: '+91-11-23061357'
                  },
                ].map((service, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      // Open website in new tab
                      if (service.url) {
                        window.open(service.url, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{service.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{service.title}</h4>
                          <p className="text-sm text-gray-600">{service.description}</p>
                          {service.phone && (
                            <p className="text-xs text-purple-600 mt-1">📞 {service.phone}</p>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Insurance & Payment Options</h4>
                <p className="text-sm text-purple-700 mb-2">
                  Many Indian insurance providers now cover mental health treatment under Ayushman Bharat and private insurance plans.
                </p>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Ayushman Bharat - PMJAY mental health coverage</li>
                  <li>• CGHS and ECHS mental health benefits</li>
                  <li>• Private insurance mental health riders</li>
                  <li>• Sliding scale fees at government hospitals</li>
                  <li>• Free services at NGO mental health centers</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrisisSupport;
