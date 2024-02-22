import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {Channel as ChannelType, StreamChat} from 'stream-chat';
import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider,
} from 'stream-chat-react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const userId = ''; // put here userId
const appKey = ''; // put here appId

const client = StreamChat.getInstance(appKey);

export const App = () => {
  const [channel, setChannel] = useState<ChannelType>();
  const [clientReady, setClientReady] = useState(false);

  const filters = {
    members: {$in: [userId]},
  };

  useEffect(() => {
    const setupClient = async () => {
      try {
        await client.connectUser(
          {
            id: userId,
          },
          client.devToken(userId),
        );
        setClientReady(true);
      } catch (e) {
        console.log(e);
      }
    };

    setupClient();
  }, []);

  const onBackPress = () => {
    if (channel) {
      setChannel(undefined);
    }
  };

  if (!clientReady) return <View style={{backgroundColor: 'blue', flex: 1}} />;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <OverlayProvider topInset={60}>
        <TouchableOpacity onPress={onBackPress} disabled={!channel}>
          <View style={{height: 60, paddingLeft: 16, paddingTop: 40}}>
            {channel && <Text>Back</Text>}
          </View>
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Chat client={client}>
            {channel ? (
              <Channel channel={channel} keyboardVerticalOffset={60}>
                <MessageList />
                <MessageInput />
              </Channel>
            ) : (
              <ChannelList filters={filters} onSelect={setChannel} />
            )}
          </Chat>
        </View>
      </OverlayProvider>
    </GestureHandlerRootView>
  );
};

export default App;
