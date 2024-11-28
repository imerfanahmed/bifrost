
    const pusher = new Pusher("app-key", {
        wsHost: 'bifrost.magicoffice.co.uk',
        wssPort: 6002,
        forceTLS: true,
        encrypted: true,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
      });
      console.log(pusher);
  
      let currentChannel;
  
      // Handle subscription
      document.getElementById("subscribe-button").addEventListener("click", () => {
        const channelName = document.getElementById("channel-input").value.trim();
        if (!channelName) {
          alert("Please enter a channel name.");
          return;
        }
  
        // Unsubscribe from the previous channel if exists
        if (currentChannel) {
          pusher.unsubscribe(currentChannel.name);
        }
  
        // Subscribe to the new channel
        currentChannel = pusher.subscribe(channelName);
        document.getElementById("channel-name").textContent = channelName;
  
        // Listen for events
        currentChannel.bind_global((eventName, data) => {
          const beautifiedData = JSON.stringify(data, null, 2);
  
          // Create an HTML block for the event
          const payload = `
            <div class="event">
              <strong>Event Name:</strong> ${eventName}
              <pre><code>${beautifiedData}</code></pre>
            </div>
          `;
  
          // Append the formatted event to the events container
          document.getElementById("events").innerHTML += payload;
        });
  
        console.log(`Subscribed to channel: ${channelName}`);
      });
  
      // Pusher connection events
      pusher.connection.bind("connected", () => {
        console.log("Connected to Pusher");
      });
  
      pusher.connection.bind("error", (err) => {
        console.error("Pusher Error:", err);
      });