const recordButton = document.getElementById("record-btn");
const stopButton = document.getElementById("stop-btn");
const recordingStatus = document.getElementById("recording-status");
const recordingsList = document.getElementById("recordings");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const taskTemplate = document.getElementById("task-template");

let mediaRecorder = null;
let audioChunks = [];
const tasks = [];

const priorityLabels = {
  3: "High",
  2: "Medium",
  1: "Low",
};

const updateTaskCount = () => {
  const count = tasks.length;
  taskCount.textContent = `${count} ${count === 1 ? "task" : "tasks"}`;
};

const sortTasks = () => {
  tasks.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return a.createdAt - b.createdAt;
  });
};

const renderTasks = () => {
  taskList.innerHTML = "";
  sortTasks();

  tasks.forEach((task, index) => {
    const node = taskTemplate.content.firstElementChild.cloneNode(true);
    const checkbox = node.querySelector("input[type='checkbox']");
    const text = node.querySelector(".task__text");
    const priority = node.querySelector(".task__priority");
    const removeButton = node.querySelector("button");

    checkbox.checked = task.completed;
    text.textContent = task.description;
    if (task.completed) {
      text.classList.add("done");
    }

    priority.textContent = `${priorityLabels[task.priority]} priority`;

    checkbox.addEventListener("change", () => {
      tasks[index].completed = checkbox.checked;
      renderTasks();
    });

    removeButton.addEventListener("click", () => {
      tasks.splice(index, 1);
      renderTasks();
    });

    taskList.appendChild(node);
  });

  updateTaskCount();
};

const setRecordingState = (isRecording) => {
  recordButton.disabled = isRecording;
  stopButton.disabled = !isRecording;
  recordingStatus.textContent = isRecording ? "Recording…" : "Idle";
  recordingStatus.classList.toggle("recording", isRecording);
};

const addRecording = (audioURL) => {
  const item = document.createElement("li");
  const audio = document.createElement("audio");
  const label = document.createElement("span");

  audio.controls = true;
  audio.src = audioURL;
  label.textContent = `Note ${recordingsList.children.length + 1}`;

  item.appendChild(label);
  item.appendChild(audio);
  recordingsList.appendChild(item);
};

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioURL = URL.createObjectURL(audioBlob);
      addRecording(audioURL);
      setRecordingState(false);
      stream.getTracks().forEach((track) => track.stop());
    });

    mediaRecorder.start();
    setRecordingState(true);
  } catch (error) {
    console.error("Microphone access was denied or unavailable.", error);
    recordingStatus.textContent = "Microphone unavailable";
  }
};

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const description = taskInput.value.trim();
  if (!description) {
    return;
  }

  const priority = Number(prioritySelect.value);
  tasks.push({
    description,
    priority,
    completed: false,
    createdAt: Date.now(),
  });

  taskInput.value = "";
  prioritySelect.value = "2";
  renderTasks();
});

renderTasks();
