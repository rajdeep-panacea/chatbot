import json
import random

# Get recent messages

def get_recent_messages():
    #define the file name and learn instruction
    file_name = "stored_data.json"
    learn_instruction = {
        "role" : "system",
        "content" : "You are a chatbot named Rachel, designed to assist users with security certification questions, provide explanations about networking devices, and guide them on how to find configuration settings on various operating systems. Your responsibilities include explaining the necessity of maintaining strong passwords and asking short, clarifying questions to better understand user needs. Your goal is to be user-friendly and provide clear, accurate, and helpful information to anyone seeking assistance. Limit your answer to 30 words."
    }

    #Initializing messages
    messages = []

    #Add a random element
    x = random.uniform(0,1)
    if x < 0.5:
        learn_instruction["content"] = learn_instruction["content"]
    else: 
        learn_instruction["content"] = learn_instruction["content"] + "Your response will have an extra advice"

    #Append instruction to message
    messages.append(learn_instruction)

    #Get last messages
    try:
        with open(file_name) as user_file:
            data = json.load(user_file)

            # Append the last 5 items of data 
            if data:
                if len(data) < 5:
                    for item in data:
                        messages.append(item)
                else:
                    for item in data[-5:]:
                        messages.append(item)

    except Exception as e:
        print(e)
        pass

    #Return
    return messages


# Save messages for retrieval later on
def store_messages(request_message, response_message):

  # Define the file name
  file_name = "stored_data.json"

  # Get recent messages
  messages = get_recent_messages()[1:]

  # Add messages to data
  user_message = {"role": "user", "content": request_message}
  assistant_message = {"role": "assistant", "content": response_message}
  messages.append(user_message)
  messages.append(assistant_message)

  # Save the updated file
  with open(file_name, "w") as f:
    json.dump(messages, f)

#Resets the messages
def reset_messages():

  #Overwrite the current file with nothing
  open("stored_data.json", "w")
