const RelationSystem = {
  _relations: {},

  add(npcId, amount) {
    const current = this._relations[npcId] || 0;
    this._relations[npcId] = Math.min(100, Math.max(0, current + amount));
  },

  get(npcId) {
    return this._relations[npcId] || 0;
  },

  reset() {
    this._relations = {};
  }
};

export default RelationSystem;
