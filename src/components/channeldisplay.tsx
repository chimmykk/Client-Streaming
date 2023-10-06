import React, { useState, useEffect } from 'react';

interface Channel {
  userlive: {
    channelName: string;
  };
}

const ChannelDisplay: React.FC = () => {
  const [channelData, setChannelData] = useState<Channel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const responseData: Channel[] = [];
        let id = 1;

        while (true) {
          const response = await fetch(`http://localhost:3004/${id}`);

          if (!response.ok) {
            break;
          }

          const jsonData = await response.json();
          responseData.push(jsonData);
          id++;
        }

        setChannelData(responseData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching channel data:', error);
        setError('Error fetching channel data. Please try again later.');
        setLoading(false);
      }
    };

    fetchChannelData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Channel Data:</h1>
      {channelData.map((channel, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <strong>Channel Name:</strong> {channel?.userlive?.channelName}
        </div>
      ))}
    </div>
  );
};

export default ChannelDisplay;
