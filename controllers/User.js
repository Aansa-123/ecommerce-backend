import User from "../models/User.js";

// Get user by ID
export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean(); // lean() returns plain JS object

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    delete user.password; // remove sensitive info
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting user details, please try again later" });
  }
};

// Update user by ID
export const updateById = async (req, res) => {
  try {
    const { id } = req.params;

    // Enforce: only super admin can change roles
    const attemptingRoleChange =
      Object.prototype.hasOwnProperty.call(req.body, "isAdmin") ||
      Object.prototype.hasOwnProperty.call(req.body, "isSuperAdmin");

    if (attemptingRoleChange && !req.user?.isSuperAdmin) {
      return res.status(403).json({ message: "Only super admin can change roles" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    delete updatedUser.password;
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating user details, please try again later" });
  }
};

// Promote user by email (super-admin only)
export const promoteByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // require super admin
    if (!req.user?.isSuperAdmin) return res.status(403).json({ message: 'Only super admin can promote users' });

    const user = await User.findOneAndUpdate({ email }, { isAdmin: true }, { new: true }).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ message: `User ${email} promoted to admin`, user: { _id: user._id, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error promoting user' });
  }
};

// Demote user by email (super-admin only)
export const demoteByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // require super admin
    if (!req.user?.isSuperAdmin) return res.status(403).json({ message: 'Only super admin can demote users' });

    // Prevent modifying super admin via this route
    const target = await User.findOne({ email });
    if (!target) return res.status(404).json({ message: 'User not found' });
    if (target.isSuperAdmin) return res.status(403).json({ message: 'Cannot modify super admin privileges via this route' });

    const user = await User.findOneAndUpdate({ email }, { isAdmin: false }, { new: true }).lean();

    return res.status(200).json({ message: `User ${email} demoted from admin`, user: { _id: user._id, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error demoting user' });
  }
};