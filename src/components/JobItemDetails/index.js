import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import Header from '../Header'
import JobDetailCard from '../JobDetailCard'

import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsApiStatus: apiStatusConstants.initial,
    jobDetailsData: {},
    similarJobsData: [],
  }

  componentDidMount() {
    this.getJobDetailsData()
  }

  getJobDetailsData = async () => {
    this.setState({jobDetailsApiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jobDetailsUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobDetailsUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const jobDetails = data.job_details
      const jobDetailsModifiedData = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        skills: jobDetails.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          description: jobDetails.life_at_company.description,
          imageUrl: jobDetails.life_at_company.image_url,
        },
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
      }
      const similarJobs = data.similar_jobs
      const similarJobsModifiedData = similarJobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobDetailsData: jobDetailsModifiedData,
        similarJobsData: similarJobsModifiedData,
        jobDetailsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  displayJobDetailsSuccessView = () => {
    const {jobDetailsData, similarJobsData} = this.state

    return (
      <>
        <JobDetailCard jobDetails={jobDetailsData} />
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobsData.map(eachSimilarJob => (
            <li className="similar-job-card-item" key={eachSimilarJob.id}>
              <div className="similar-job-logo-title-container">
                <img
                  src={eachSimilarJob.companyLogoUrl}
                  alt="similar job company logo"
                  className="similar-job-company-logo"
                />
                <div>
                  <h1 className="similar-job-title">{eachSimilarJob.title}</h1>
                  <div className="similar-job-rating-container">
                    <AiFillStar className="similar-job-star-icon" />
                    <p className="similar-job-rating">
                      {eachSimilarJob.rating}
                    </p>
                  </div>
                </div>
              </div>
              <h1 className="similar-job-description-heading">Description</h1>
              <p className="similar-job-description">
                {eachSimilarJob.jobDescription}
              </p>
              <div className="similar-job-location-employment-container">
                <div className="similar-job-location-container">
                  <MdLocationOn className="similar-job-location-icon" />
                  <p className="similar-job-location-label">
                    {eachSimilarJob.location}
                  </p>
                </div>
                <div className="similar-job-employment-type-container">
                  <BsBriefcaseFill className="similar-job-location-icon" />
                  <p className="similar-job-location-label">
                    {eachSimilarJob.employmentType}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  displayJobDetailsLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  displayJobDetailsFailureView = () => (
    <div className="no-jobs-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-jobs-found-image"
      />
      <h1 className="no-jobs-found-heading">Oops! Something Went Wrong</h1>
      <p className="no-jobs-found-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.getJobDetailsData}
      >
        Retry
      </button>
    </div>
  )

  displayJobDetails = () => {
    const {jobDetailsApiStatus} = this.state
    switch (jobDetailsApiStatus) {
      case apiStatusConstants.success:
        return this.displayJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.displayJobDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.displayJobDetailsLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="job-details-bg-container">
          {this.displayJobDetails()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails
