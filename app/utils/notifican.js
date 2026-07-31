import axios from 'axios'

const notifican = async (message, data = {}) => {
  try {
    await axios.post(`https://api.notifican.com/063ca464-09f2-4a86-82f4-478c83234fad`, {
      categoryId: 27,
      message,
      data,
      telegram: true
    }, {
      headers: {
        Authorization: `Bearer fc8ac7bb-bb35-4a66-b400-398fdba3852c`
      }
    })
  } catch (e) {
    console.log(e)
  }
}

export default notifican
