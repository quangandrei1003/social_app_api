const express = require('express');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

const auth = require('../../middleware/auth');
const router = express.Router();

//get profile by username
router.get('/:username', getProfileByName, async (req, res) => {
  // res.send('Profiles Route');
  const user = req.profile;
  const profile = user.getProfile();
  res.json({ profile: profile });
  // profile.following = true;  

  // console.log(profile);

  // console.log(user.getProfile());
})

//follow a user
router.post('/:username/follow', [auth, getProfileByName], async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const followingUserId = req.profile.id;
    const followingUserProfile = req.profile.getProfile();
    if (user.isFollowing(followingUserId)) {
      return res.status(400).json({ message: 'You already followed this user' });
    }

    user.follow(followingUserId);
    followingUserProfile.following = true;
    res.json(followingUserProfile);
    // res.send('Followed!'); 

  } catch (error) {
    console.error(error);
    res.status(422).json({ message: 'Unexpected error!' });
  }
})

//unfollow a user
router.delete('/:username/unfollow', auth, getProfileByName, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const unFollowingUserId = req.profile.id;
    const unFollowingUserProfile = req.profile.getProfile();

    user.unfollow(unFollowingUserId);
    unFollowingUserProfile.following = false;
    console.log(user.following);
    res.json(unFollowingUserProfile);
    // res.send('UnFollowed!'); 

  } catch (error) {
    console.error(error);
    res.status(422).json({ message: 'Unexpected error!' });
  }
})

//getprofile middeware
async function getProfileByName(req, res, next) {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username: username });

    if (user === null || undefined) {
      return res.status(404).json({ message: 'Cant not found this user!' });
    }

    req.profile = user;

  } catch (error) {
    res.status(500).json({ message: 'Server error!' });
  }
  next();
}

module.exports = router; 