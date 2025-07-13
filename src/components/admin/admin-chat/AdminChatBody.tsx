"use client";
import { Search, Send, Clock, MessageCircle, Check, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Badge } from '@/components/base/Badge';
import Button from '@/components/base/Button';
import { Card, CardContent } from '@/components/base/Card';
import Input from '@/components/base/Input';
import { Avatar, AvatarImage } from '@/components/base/Avatar';
import { useAdminChatStore } from "@/stores/chat/adminChatStore";

const AdminChatBody = function () {
  const {
    chatSessions,
    selectedUserId,
    selectChatSession,
    inputValue,
    setInputValue,
    sendMessage,
    initializeSocket,
    disconnectSocket,
    isTyping,
    isConnected,
    connectionError,
  } = useAdminChatStore();

  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    const selectedChat = chatSessions.find(chat => chat.userId === selectedUserId);
    if (selectedChat) scrollToBottom();
  }, [chatSessions, selectedUserId]);

  // Initialize socket on mount and cleanup on unmount
  useEffect(() => {
    initializeSocket();
    
    return () => {
      disconnectSocket();
    };
  }, [initializeSocket, disconnectSocket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChatSelect = (userId: string) => {
    selectChatSession(userId);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && selectedUserId) {
      sendMessage(inputValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = chatSessions.filter(chat =>
    chat.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.messages.at(-1)?.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedChatData = chatSessions.find(chat => chat.userId === selectedUserId);
  const messages = selectedChatData?.messages || [];
  const totalUnreadCount = chatSessions.reduce((sum, chat) => sum + chat.unreadCount, 0);

  const getConnectionStatus = () => {
    if (connectionError) return { text: 'Connection Error', color: 'bg-red-100 text-red-700' };
    if (isConnected) return { text: 'Connected', color: 'bg-green-100 text-green-700' };
    return { text: 'Connecting...', color: 'bg-yellow-100 text-yellow-700' };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <main className="w-full max-w-[1296px]">
      <section>
        <div className="mb-8 px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl text-[#004a7c] font-['Poppins',Helvetica] leading-[30px] mb-2">
                Chat Management
              </h1>
              <p className="text-base text-gray-600 font-['Poppins',Helvetica] leading-4">
                Manage customer conversations and support requests
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Badge className="bg-gray-100 text-gray-700 font-normal">
              {chatSessions.length} Total Chats
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 font-normal">
              {chatSessions.filter(chat => chat.isActive).length} Active
            </Badge>
            <Badge className="bg-red-100 text-red-700 font-normal">
              {totalUnreadCount} Unread Messages
            </Badge>
            <Badge className={`${connectionStatus.color} font-normal`}>
              {connectionStatus.text}
            </Badge>
          </div>

          {connectionError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{connectionError}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <Card className="rounded-xl shadow-[0px_1px_2px_#0000000d] border-0 h-[600px]">
              <CardContent className="p-0">
                <div className="p-4 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search chats..."
                      className="pl-10 w-full"
                    />
                  </div>
                </div>

                <div className="overflow-y-auto h-[520px]">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.userId}
                      onClick={() => handleChatSelect(chat.userId)}
                      className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${selectedUserId === chat.userId ? 'bg-blue-50 border-blue-200' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage src="/user.png" alt={chat.userName} />
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-[#004a7c] truncate">{chat.userName}</h3>
                            <div className="flex items-center gap-2">
                              {chat.unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                  {chat.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{chat.messages.at(-1)?.text || 'No messages yet'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {chat.messages.length > 0
                                ? new Date(chat.messages[chat.messages.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : 'No activity'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredChats.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No chat sessions found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Messages */}
          <div className="lg:col-span-2">
            <Card className="rounded-xl shadow-[0px_1px_2px_#0000000d] border-0 h-[600px]">
              <CardContent className="p-0 flex flex-col h-full">
                {selectedChatData ? (
                  <>
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="/user.png" alt={selectedChatData.userName} />
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-[#004a7c]">{selectedChatData.userName}</h3>
                          <p className="text-sm text-gray-500">
                            {selectedChatData.isActive ? 'Active' : 'Inactive'} • {selectedChatData.messages.length} messages
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => selectChatSession('')}
                        className="bg-gray-100 text-gray-600 rounded-lg h-8 w-8 p-0 hover:bg-gray-200"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message, index) => (
                        <div key={index} className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex items-end gap-2 ${message.sender === 'admin' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {message.sender === 'user' && (
                              <Avatar className="w-8 h-8">
                                <AvatarImage src="/user.png" alt="User" />
                              </Avatar>
                            )}

                            <div className={`max-w-[1000%] p-3 rounded-2xl text-sm whitespace-pre-wrap
                              ${message.sender === 'admin' 
                                ? 'bg-[#00a9e0] text-white rounded-br-none' 
                                : 'bg-gray-100 text-gray-900 rounded-bl-none'
                              }`}
                            >
                              <p>{message.text}</p>
                              <div className={`flex items-center gap-1 mt-1 text-xs 
                                ${message.sender === 'admin' ? 'justify-end text-blue-100' : 'justify-start text-gray-500'}
                              `}>
                                <span>
                                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {message.sender === 'admin' && (
                                  <Check className="w-3 h-3" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {messages.length === 0 && (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No messages yet. Start the conversation!</p>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="px-4 pb-2 text-sm text-gray-400 italic">
                        {selectedChatData.userName} is typing...
                      </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-gray-100">
                      <div className="flex gap-2">
                        <textarea
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          rows={2}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a9e0] focus:border-transparent resize-none"
                          disabled={!isConnected}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim() || !isConnected}
                          className="bg-[#00a9e0] text-white rounded-lg h-[68px] px-4 flex items-center justify-center hover:bg-[#0088b8] disabled:bg-gray-300"
                        >
                          <Send className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">Select a chat to start messaging</h3>
                      <p className="text-sm">Choose a conversation from the list to view and respond to messages</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminChatBody;