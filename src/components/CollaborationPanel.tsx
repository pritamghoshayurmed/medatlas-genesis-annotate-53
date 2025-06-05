
import { useState } from 'react';
import { Users, MessageCircle, UserPlus, Video, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const CollaborationPanel = () => {
  const [message, setMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const collaborators = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      role: 'Radiologist',
      status: 'online',
      avatar: 'SC',
      lastActive: 'now',
      isEditing: true
    },
    {
      id: 2,
      name: 'Dr. Michael Rodriguez',
      role: 'Researcher',
      status: 'online',
      avatar: 'MR',
      lastActive: '5 min ago',
      isEditing: false
    },
    {
      id: 3,
      name: 'Dr. Emily Johnson',
      role: 'Pathologist',
      status: 'away',
      avatar: 'EJ',
      lastActive: '1 hour ago',
      isEditing: false
    }
  ];

  const messages = [
    {
      id: 1,
      author: 'Dr. Sarah Chen',
      message: 'I think we should focus on the enhanced region in slice 45',
      timestamp: '2:34 PM',
      avatar: 'SC'
    },
    {
      id: 2,
      author: 'Dr. Michael Rodriguez',
      message: 'Agreed. The AI suggestion looks accurate there.',
      timestamp: '2:35 PM',
      avatar: 'MR'
    },
    {
      id: 3,
      author: 'You',
      message: 'Should we increase the confidence threshold?',
      timestamp: '2:36 PM',
      avatar: 'YO'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic here
      setMessage('');
    }
  };

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      {/* Active Collaborators */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-400" />
              <span>Active Team</span>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-6 w-6 p-0">
              <UserPlus className="w-3 h-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">{collaborator.avatar}</span>
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(collaborator.status)} rounded-full border-2 border-slate-800`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-white text-sm font-medium truncate">{collaborator.name}</p>
                  {collaborator.isEditing && (
                    <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10 text-xs">
                      Editing
                    </Badge>
                  )}
                </div>
                <p className="text-slate-400 text-xs">{collaborator.role} • {collaborator.lastActive}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Video Call Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-3">
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-slate-600 text-slate-300 hover:text-white"
            >
              <Video className="w-4 h-4 mr-2" />
              Video Call
            </Button>
            <Button
              variant={isMuted ? "destructive" : "outline"}
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className={isMuted ? "" : "border-slate-600 text-slate-300 hover:text-white"}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat */}
      <Card className="bg-slate-800/50 border-slate-700 flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center space-x-2">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <span>Team Chat</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 space-y-3">
          <ScrollArea className="flex-1 pr-3">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="flex space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">{msg.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white text-sm font-medium">{msg.author}</span>
                      <span className="text-slate-400 text-xs">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              size="sm"
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaborationPanel;
