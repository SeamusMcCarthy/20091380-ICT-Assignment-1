'use strict';

const assessmentStore = require('../models/assessment-store');
const memberStore = require('../models/member-store');

const INCHES_IN_METER = 39.37;
const KILOS_PER_INCH = 2.3;
const HEIGHT_LIMIT = 60;
const TOLERANCE = 0.2;

const analytics = {
  calculateBMI(memberid) {
    const member = memberStore.getMemberById(memberid);
    const latestweight = assessmentStore.getLatestWeight(memberid);
    if (assessmentStore.getLatestWeight(memberid) == null)
      return member.startingweight / Math.pow(member.height, 2);
    else
      return latestweight / Math.pow(member.height, 2);
  },

  determineBMICategory(BMI) {
    if (BMI < 16)
      return "SEVERELY UNDERWEIGHT";
    else if (BMI < 18.5)
      return "UNDERWEIGHT";
    else if (BMI < 25)
      return "NORMAL";
    else if (BMI < 30)
      return "OVERWEIGHT";
    else if (BMI < 35)
      return "MODERATELY OBESE";
    else
      return "SEVERELY OBESE";
  },

  isIdealBodyWeight(memberid) {
    const member = memberStore.getMemberById(memberid);
    const heightInInches = member.height * INCHES_IN_METER;
    let limitWeight = 0;
    let idealWeight = 0;
    let currentWeight = 0;

    // Set lower limit weight based on gender
    if (member.gender === 'M')
      limitWeight = 50;
    else
      limitWeight = 45.5;

    // Calc additional weight per inch over height limit
    if (heightInInches <= HEIGHT_LIMIT)
      idealWeight = limitWeight;
    else
      idealWeight = limitWeight + ((heightInInches - HEIGHT_LIMIT) * KILOS_PER_INCH);

    // If no recorded assessments, use starting weight
    const latestweight = assessmentStore.getLatestWeight(memberid);
    if (latestweight === 0 || latestweight == null)
      currentWeight = member.startingweight;
    else
      currentWeight = latestweight;

    // Round the figure, return the absolute value and check if within tolerance
    return Math.abs((currentWeight - idealWeight).toFixed(2)) <= TOLERANCE;
  },
}

module.exports = analytics;
