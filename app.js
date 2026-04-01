const SUPABASE_URL = "https://foijfiuvfipiloqclrmo.supabase.co";
const SUPABASE_KEY = "sb_publishable_NNMBO_8v1x-P1eSZ4wpBlQ_Q6DBDRM4";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let user = null;

async function signIn() {
  // First try to reuse existing session
  const { data: sessionData, error: sessionError } =
    await supabaseClient.auth.getSession();

  if (sessionError) {
    console.error("Session error:", sessionError);
    return;
  }

  if (sessionData.session && sessionData.session.user) {
    user = sessionData.session.user;
    console.log("Reused existing user:", user);
    await loadTasks();
    return;
  }

  // Only create anonymous user if no session exists
  const { data, error } = await supabaseClient.auth.signInAnonymously();

  if (error) {
    console.error("Sign-in error:", error);
    return;
  }

  user = data.user;
  console.log("Signed in new anonymous user:", user);
  await loadTasks();
}

async function addTask() {
  try {
    const input = document.getElementById("taskInput");
    const priorityInput = document.getElementById("priorityInput");
    const dueDateInput = document.getElementById("dueDateInput");
    const labelInput = document.getElementById("labelInput");

    const title = input.value.trim();
    const priority = priorityInput.value;
    const dueDate = dueDateInput.value || null;
    const label = labelInput.value || null;

    if (!title) return;

    if (!user) {
      console.error("User is null.");
      return;
    }

    const { data, error } = await supabaseClient
      .from("tasks")
      .insert([
        {
          title: title,
          status: "todo",
          user_id: user.id,
          priority: priority,
          due_date: dueDate,
          label: label
        }
      ])
      .select();

    if (error) {
      console.error("Insert error:", error);
      return;
    }

    console.log("Inserted task:", data);

    input.value = "";
    priorityInput.value = "normal";
    dueDateInput.value = "";
    labelInput.value = "";
    await loadTasks();
  } catch (err) {
    console.error("Add task error:", err);
  }
}

async function loadTasks() {
  try {
    const searchValue = document.getElementById("searchInput")?.value.toLowerCase() || "";

    const sortValue = document.getElementById("sortInput")?.value || "created";

let query = supabaseClient.from("tasks").select("*");

if (sortValue === "due_date") {
  query = query.order("due_date", { ascending: true });
} else {
  query = query.order("created_at", { ascending: true });
}

const { data, error } = await query;

    if (error) {
      console.error("Load error:", error);
      return;
    }

    console.log("Loaded tasks:", data);

    if (sortValue === "priority") {
  const priorityOrder = { high: 1, normal: 2, low: 3 };

  data.sort((a, b) => {
    return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
  });
}
    const today = new Date().toISOString().split("T")[0];

    const totalTasks = data.length;
    const completedTasks = data.filter(task => task.status === "done").length;
    const overdueTasks = data.filter(
  task => task.due_date && task.due_date < today && task.status !== "done"
).length;

    document.getElementById("totalTasks").innerText = totalTasks;
    document.getElementById("completedTasks").innerText = completedTasks;
    document.getElementById("overdueTasks").innerText = overdueTasks;

    document.getElementById("todo").innerHTML = "<h2>To Do</h2>";
    document.getElementById("in_progress").innerHTML = "<h2>In Progress</h2>";
    document.getElementById("in_review").innerHTML = "<h2>In Review</h2>";
    document.getElementById("done").innerHTML = "<h2>Done</h2>";

    const filteredTasks = data.filter((task) =>
      task.title.toLowerCase().includes(searchValue)
    );

    filteredTasks.forEach((task) => {
      const div = document.createElement("div");
      div.className = "task";

      const title = document.createElement("div");
      title.className = "task-title";
      title.innerText = task.title;
      div.appendChild(title);

      const priority = document.createElement("div");
      priority.className = `task-meta priority-${task.priority || "normal"}`;
      priority.innerText = `Priority: ${task.priority || "normal"}`;
      div.appendChild(priority);

      if (task.label) {
  const labelDiv = document.createElement("div");
  labelDiv.className = `task-label label-${task.label.toLowerCase()}`;
  labelDiv.innerText = task.label;
  div.appendChild(labelDiv);
}
      if (task.due_date) {
  const dueDate = document.createElement("div");
  dueDate.className = "task-meta";

  const today = new Date().toISOString().split("T")[0];

  if (task.due_date < today && task.status !== "done") {
    dueDate.innerText = `⚠️ OVERDUE: ${task.due_date}`;
    dueDate.style.color = "red";
    div.style.border = "2px solid red";
  } else {
    dueDate.innerText = `Due: ${task.due_date}`;
  }

  div.appendChild(dueDate);
}

      const buttonRow = document.createElement("div");
      buttonRow.className = "task-buttons";

      const moveBtn = document.createElement("button");
      moveBtn.innerText = "Move";
      moveBtn.onclick = () => moveTask(task);
      buttonRow.appendChild(moveBtn);

      const editBtn = document.createElement("button");
      editBtn.innerText = "Edit";
      editBtn.onclick = () => editTask(task);
      buttonRow.appendChild(editBtn);

      if (task.status === "done") {
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.onclick = async () => {
          await deleteTask(task.id);
        };
        buttonRow.appendChild(deleteBtn);
      }

      div.appendChild(buttonRow);

      document.getElementById(task.status).appendChild(div);
    });
  } catch (err) {
    console.error("Load tasks error:", err);
  }
}

async function moveTask(task) {
  let newStatus;

  if (task.status === "todo") newStatus = "in_progress";
  else if (task.status === "in_progress") newStatus = "in_review";
  else if (task.status === "in_review") newStatus = "done";
  else return;

  const { error } = await supabaseClient
    .from("tasks")
    .update({ status: newStatus })
    .eq("id", task.id);

  if (error) {
    console.error("Update error:", error);
    return;
  }

  await loadTasks();
}

async function editTask(task) {
  const newTitle = prompt("Edit task title:", task.title);
  if (newTitle === null) return;

  const newPriority = prompt("Edit priority (low, normal, high):", task.priority || "normal");
  if (newPriority === null) return;

  const newDueDate = prompt("Edit due date (YYYY-MM-DD) or leave blank:", task.due_date || "");
  if (newDueDate === null) return;

  const newLabel = prompt("Edit label (Bug, Feature, Design) or leave blank:", task.label || "");
  if (newLabel === null) return;

  const cleanedTitle = newTitle.trim();
  const cleanedPriority = newPriority.trim().toLowerCase();
  const cleanedDueDate = newDueDate.trim() === "" ? null : newDueDate.trim();
  const cleanedLabel = newLabel.trim() === "" ? null : newLabel.trim();

  if (!cleanedTitle) {
    alert("Title cannot be empty.");
    return;
  }

  if (!["low", "normal", "high"].includes(cleanedPriority)) {
    alert("Priority must be low, normal, or high.");
    return;
  }

  if (cleanedLabel && !["Bug", "Feature", "Design"].includes(cleanedLabel)) {
    alert("Label must be Bug, Feature, Design, or blank.");
    return;
  }

  const { error } = await supabaseClient
    .from("tasks")
    .update({
      title: cleanedTitle,
      priority: cleanedPriority,
      due_date: cleanedDueDate,
      label: cleanedLabel
    })
    .eq("id", task.id);

  if (error) {
    console.error("Edit error:", error);
    return;
  }

  await loadTasks();
}

async function deleteTask(taskId) {
  const { error } = await supabaseClient
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) {
    console.error("Delete error:", error);
    return;
  }

  await loadTasks();
}

signIn();