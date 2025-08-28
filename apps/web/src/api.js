const API = {
  token() {
    return localStorage.getItem("adminToken") || "";
  },
  async login(username, password) {
    const r = await fetch("/api/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({username, password})
    });
    const j = await r.json();
    if (j.ok && j.token) {
      localStorage.setItem("adminToken", j.token);
    }
    return j;
  },
  headers() {
    const t = this.token();
    return t ? { Authorization: `Bearer ${t}` } : {};
  },

  // counts
  async counts() {
    const r = await fetch(`/api/tasks_counts`);
    return r.json();
  },

  // tasks
  async getTasks(params={}) {
    const q = new URLSearchParams(params).toString();
    const r = await fetch(`/api/tasks?${q}`);
    return r.json();
  },
  async getTask(id) {
    const r = await fetch(`/api/tasks/${id}`);
    return r.json();
  },
  async createTask(payload){
    const r = await fetch(`/api/tasks`, {
      method:"POST",
      headers:{"Content-Type":"application/json", ...this.headers()},
      body: JSON.stringify(payload)
    });
    return r.json();
  },
  async updateTask(id, payload){
    const r = await fetch(`/api/tasks/${id}`, {
      method:"PATCH",
      headers:{"Content-Type":"application/json", ...this.headers()},
      body: JSON.stringify(payload)
    });
    return r.json();
  },
  async deleteTask(id){
    const r = await fetch(`/api/tasks/${id}`, {
      method:"DELETE",
      headers:{...this.headers()}
    });
    return r.json();
  },

  // updates
  async createUpdate(taskId, formData){
    const r = await fetch(`/api/tasks/${taskId}/updates`, {
      method:"POST",
      headers:{...this.headers()},
      body: formData
    });
    return r.json();
  },
  async editUpdate(updateId, formData){
    const r = await fetch(`/api/updates/${updateId}`, {
      method:"PATCH",
      headers:{...this.headers()},
      body: formData
    });
    return r.json();
  },
  async deleteUpdate(updateId){
    const r = await fetch(`/api/updates/${updateId}`, {
      method:"DELETE",
      headers:{...this.headers()}
    });
    return r.json();
  },

  // history + export
  async getHistory(params={}){
    const q = new URLSearchParams(params).toString();
    const r = await fetch(`/api/history?${q}`);
    return r.json();
  },

  // tags suggest
  async tagSuggest(s=""){
    const r = await fetch(`/api/tags?suggest=${encodeURIComponent(s)}`);
    return r.json();
  }
};

export default API;
