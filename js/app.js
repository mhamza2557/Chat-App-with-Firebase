var enterName = prompt('Enter your name: ')

if (enterName != null && enterName != "") {

    document.getElementById('main').innerHTML = `
    <div class="container p-2">
        <div class="text-center">
            <form onsubmit="return sendMessage()">
                <input id="message" placeholder="Enter messsage" autocomplete="off">
                <input class="btn btn-warning m-1" id="messageBtn" value="Send" type="submit">
            </form>
            <div class='scroll-y'>
                <table id="messages">
                    <tr>
                        <th>Sender</th>
                        <th>Messages</th>
                        <th>Action</th>
                    </tr>
                </table>
            </div>
        </div>
    </div>`

    function sendMessage() {
        var message = document.getElementById('message')
        firebase.database().ref('messages').push().set({
            'sender' : enterName,
            'message' : message.value
        })
        message.value = null
        return false
    }
    
    firebase.database().ref('messages').on('child_added', function(snapshot) {
        var html = `<tr><td>${snapshot.val().sender}</td><td>${snapshot.val().message}</td>`
        if (snapshot.val().sender == enterName) {
            html += `<td><button class='btn btn-danger' data-id='${snapshot.key}' onclick='deleteMessage(this)'>Delete</button></td></tr>`
        } else {
            html += `<td>Delete Only <b>${snapshot.val().sender}</b></td></tr>`
        }
        document.getElementById('messages').innerHTML += html
    })
    
    function deleteMessage(button) {
        var messageID = button.getAttribute('data-id')
        firebase.database().ref('messages').child(messageID).remove()
        button.parentNode.parentNode.remove()
    }
} else {
    document.getElementById('main').innerHTML = ''
}
