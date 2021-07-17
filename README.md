# iDoc App

## Instructions: how to start

create `.env` file like the example `.env.sample`

start with `npm run start-dev`

**http://localhost:5000**

## Description


iDoc App is an app that will make patients' and health professionals' life easier by helping them keep track of appointments, test results, and much more.
​

## Motivation

Just a litle API for educational purposes.



## User stories

​
**404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
​

**500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault

​
**Landing page** - As a user I want to be able to access the landing page so that I see what the app is about and login and signup

​
**Sign up** - As a health professional I want to be able to create an account to use the app and also to be able to create a new patient and its basic profile with contact information.

​
**Login** - As a user I want to be able to log in on the webpage

​
**Logout** - As a user I want to be able to log out from the webpage

​
**Profile** - As a patient user I want to be able to see my profile and edit my contact information. As a health professional I want to be able to see my patient's profile information.

​
**Daily schedule** - As a health professional user I want to be able to see the appointments I have for the day.

**Calendar** - As a patient I want to be able to see the all past and future appointments, as well as request a new appointment.

**Double role** - As a health professional, I want to be able to switch to patient views within the app without having to sign out and back in.

**Clinical history** - As a health professional, I want to be able to edit my patient's clinical histories, adding or editing the patient's patologies. As a patient, I want to be able to see my clinical history.

**Documents** - As a health professional user, I want to be able to upload documents (reports, test results) to the patients clinical history.

​
**Confidentiality** - As a health professional, I won't be able to access personal information of patients that are not under my care.

## Backlog

​
**Chat** - Patients and health professionals can communicate in the app chat.

**Data analysis** - Health professionals can obtain basic statistical indicators about the patients' conditions.
​

## ROUTES:


### Main


| Method | Path | Description | Body | |
| ------ | ----------------------------- | ------------------------------------------------ | ------------------------------------- | --------------- |
| GET |` /` | Landing page | | |
| GET |` /about` | Information about the app | | |
### Auth


| Method | Path | Description | Body | |
| ------ | ----------------------------- | ------------------------------------------------ | ------------------------------------- | --------------- |
| POST | `/signup` | Sign up a health professional | `{ mail, full name, password, speciality }` | |
| POST | `/login` | Log in the user | `{ mail, password }` | |
| POST | `/logout` | Logout a user | |

 
### Health professionals
| Method | Path | Description | Body | |
| ------ | ----------------------------- | ------------------------------------------------ | ------------------------------------- | --------------- |
| GET | `/professionals/home` | Homepage in professional side of the app | |
| POST | `/professionals/add` | Add new patient to database | `{isProfessional, email, phoneNr, password, name, birthDate, weight, height, conditions, appointments}`
| GET | `/professionals/:id` | Read patient's clinical history | | |
| POST | `/professionals/:id` | Edit patient's clinical history | `{isProfessional, email, password, phoneNr, name, birthDate, weight, height, conditions, appointments}` | |
| GET | `/professionals/daily` | Read daily schedule | | |
|

### Patients
| Method | Path | Description | Body | |
| ------ | ----------------------------- | ------------------------------------------------ | ------------------------------------- | --------------- |
| GET | `/patients/home` | Homepage in patient side of the app | |
| GET | `/patients/profile` | Display personal information 
| POST | `/patients/profile` | Update contact information | `{email, phoneNr}`| 
| GET | `/patients/appointments` | Display appointments 
| POST | `/patients/appointments` | Create new appointments | | 
|



## Models

User model

```javascript
{
	email: String,
	password: String,
	name: String,
	specialty: {
		type: String,
		enum: [
			'Cardiologist',
			'Dermatologist',
			'Gynecologist',
			'Pediatrician',
			'Psychiatrist',
			...
		]
	},
	isProfessional: Boolean,
	phoneNr: Number,
	birthDate: {
		day: Number,
		month: Number,
		year: Number
	}
	weight: Number,
	height: Number,
	conditions: String,
	documents: [
		{
			type: ??
		}
	]
	appointments: [
		{
			type: ObjectId,
		ref: Appointment
		}
	],
	{
		timestamps: true
	}
}
```


Appointment model
```javascript
{
	date: Object,
	patient: ObjectId<User>,
	professional: ObjectId<User>,
	{
	timestamps: true
	}
}
```

## Links

### Trello

Link to Trello

### Git

[Repository Link](https://github.com/mrnlts/iDoc-backend)

[Deploy Link](http://heroku.com/)

### Slides

[Slides Link](http://slides.com/)
