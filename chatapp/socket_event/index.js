export default (io, socket) => {
  // 入室メッセージをクライアントに送信する
  socket.on("enterEvent", (data) => {
    socket.broadcast.emit("enterEvent", data)
  })

  // 退室メッセージをクライアントに送信する
  socket.on("exitEvent", (data) => {
    socket.broadcast.emit("exitEvent", data)
  })

  // 投稿メッセージを送信する
  socket.on("publishEvent", (data) => {
    io.sockets.emit("publishEvent", data)
  })

  // レポート送信イベントを受信する
  socket.on("reportSubmit", (data) => {
    io.sockets.emit("reportSubmit", data)
    console.log("Report submitted:", data)
  })

  // フィードバック送信イベントを受信する
  socket.on("sendFeedbackEvent", (data) => {
    console.log("サーバー側でsendFeedbackEventを受信:", data)
    io.sockets.emit("sendFeedbackEvent", data)
    console.log("全クライアントにsendFeedbackEventを送信しました")
  })
}