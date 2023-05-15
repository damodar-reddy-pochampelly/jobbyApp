import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import JobCard from '../JobCard'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileData: {},
    profileApiStatus: apiStatusConstants.initial,
    jobsData: [],
    jobsApiStatus: apiStatusConstants.initial,
    employmentType: [],
    minimumPackage: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getJobsData = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {employmentType, minimumPackage, searchInput} = this.state
    const employmentTypeString = employmentType.join(',')
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeString}&minimum_package=${minimumPackage}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const jobDetails = data.jobs
      const modifiedJobsData = jobDetails.map(eachJobData => ({
        companyLogoUrl: eachJobData.company_logo_url,
        employmentType: eachJobData.employment_type,
        id: eachJobData.id,
        jobDescription: eachJobData.job_description,
        location: eachJobData.location,
        packagePerAnnum: eachJobData.package_per_annum,
        rating: eachJobData.rating,
        title: eachJobData.title,
      }))
      this.setState({
        jobsData: modifiedJobsData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  getProfileData = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const profileUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const profileDetails = data.profile_details
      const modifiedData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileData: modifiedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  displayProfileSuccessView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-picture" />
        <h1 className="applicant-name">{name}</h1>
        <p className="applicant-bio">{shortBio}</p>
      </div>
    )
  }

  displayLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  displayProfileFailureView = () => (
    <div className="profile-failure-container">
      <button type="button" className="retry-btn" onClick={this.getProfileData}>
        Retry
      </button>
    </div>
  )

  displayJobsSuccessView = () => {
    const {jobsData} = this.state

    if (jobsData.length === 0) {
      return (
        <div className="no-jobs-found-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-found-image"
          />
          <h1 className="no-jobs-found-heading">No Jobs Found</h1>
          <p className="no-jobs-found-description">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      )
    }

    return (
      <ul className="jobs-card-container">
        {jobsData.map(eachJob => (
          <JobCard key={eachJob.id} jobData={eachJob} />
        ))}
      </ul>
    )
  }

  displayJobsFailureView = () => (
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
      <button type="button" className="retry-btn" onClick={this.getJobsData}>
        Retry
      </button>
    </div>
  )

  displayJobs = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.displayJobsSuccessView()
      case apiStatusConstants.failure:
        return this.displayJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.displayLoadingView()
      default:
        return null
    }
  }

  displayProfile = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.displayProfileSuccessView()
      case apiStatusConstants.failure:
        return this.displayProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.displayLoadingView()
      default:
        return null
    }
  }

  filterSearchInput = () => {
    this.getJobsData()
  }

  filterEmploymentType = event => {
    const {employmentType} = this.state
    if (event.target.checked) {
      this.setState(
        {employmentType: [...employmentType, event.target.value]},
        this.getJobsData,
      )
    } else {
      const modifiedArray = employmentType.filter(
        eachItem => eachItem !== event.target.value,
      )
      this.setState({employmentType: modifiedArray}, this.getJobsData)
    }
  }

  filterSalaryRange = event => {
    this.setState({minimumPackage: event.target.value}, this.getJobsData)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  render() {
    return (
      <div>
        <Header />
        <div className="jobs-bg-container">
          <div className="search-container-sm">
            <input
              type="search"
              placeholder="Search"
              className="input-sm"
              onChange={this.onChangeSearchInput}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-btn"
              onClick={this.filterSearchInput}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="profile-filters-container-lg">
            {this.displayProfile()}
            <div className="employment-bg-container">
              <h1 className="filter-heading">Type of Employment</h1>
              <ul className="filter-items-container">
                {employmentTypesList.map(eachType => (
                  <li key={eachType.employmentTypeId} className="filter-item">
                    <input
                      type="checkbox"
                      id={eachType.employmentTypeId}
                      value={eachType.employmentTypeId}
                      onClick={this.filterEmploymentType}
                    />
                    <label
                      htmlFor={eachType.employmentTypeId}
                      className="filter-label"
                    >
                      {eachType.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="employment-bg-container">
              <h1 className="filter-heading">Salary Range</h1>
              <ul className="filter-items-container">
                {salaryRangesList.map(eachRange => (
                  <li key={eachRange.salaryRangeId} className="filter-item">
                    <input
                      type="radio"
                      id={eachRange.salaryRangeId}
                      value={eachRange.salaryRangeId}
                      name="salary"
                      onClick={this.filterSalaryRange}
                    />
                    <label
                      htmlFor={eachRange.salaryRangeId}
                      className="filter-label"
                    >
                      {eachRange.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="jobs-container">
            <div className="search-container-lg">
              <input
                type="search"
                placeholder="Search"
                className="input-sm"
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.filterSearchInput}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.displayJobs()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
