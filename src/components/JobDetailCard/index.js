import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {HiExternalLink} from 'react-icons/hi'

import './index.css'

const JobDetailCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    companyWebsiteUrl,
    jobDescription,
    skills,
    lifeAtCompany,
  } = jobDetails

  return (
    <div className="job-detail-card">
      <div className="job-detail-logo-title-container">
        <img
          src={companyLogoUrl}
          alt="job details company logo"
          className="job-detail-company-logo"
        />
        <div>
          <h1 className="job-detail-title">{title}</h1>
          <div className="job-detail-rating-container">
            <AiFillStar className="job-detail-star-icon" />
            <p className="job-detail-rating">{rating}</p>
          </div>
        </div>
      </div>
      <div className="job-detail-pkg-location-container">
        <div className="job-detail-location-employment-container">
          <div className="job-detail-location-container">
            <MdLocationOn className="job-detail-location-icon" />
            <p className="job-detail-location-label">{location}</p>
          </div>
          <div className="job-detail-employment-type-container">
            <BsBriefcaseFill className="job-detail-location-icon" />
            <p className="job-detail-location-label">{employmentType}</p>
          </div>
        </div>
        <p className="job-detail-pkg">{packagePerAnnum}</p>
      </div>
      <hr className="line" />
      <div className="job-detail-description-container">
        <h1 className="job-detail-description">Description</h1>
        <a href={companyWebsiteUrl} className="visit-link">
          <div className="visit-link-container">
            <p className="visit">Visit</p>
            <HiExternalLink className="visit-icon" />
          </div>
        </a>
      </div>
      <p className="job-detail-job-description">{jobDescription}</p>
      <h1 className="skills-heading">Skills</h1>
      <ul className="skills-container">
        {skills.map(eachSkill => (
          <li key={eachSkill.name} className="skill-item">
            <img
              src={eachSkill.imageUrl}
              alt={eachSkill.name}
              className="skill-image"
            />
            <p className="skill-name">{eachSkill.name}</p>
          </li>
        ))}
      </ul>
      <h1 className="life-at-company">Life at Company</h1>
      <div className="life-at-company-image-description">
        <p className="life-at-company-description">
          {lifeAtCompany.description}
        </p>
        <img
          src={lifeAtCompany.imageUrl}
          alt="life at company"
          className="life-at-company-image"
        />
      </div>
    </div>
  )
}

export default JobDetailCard
