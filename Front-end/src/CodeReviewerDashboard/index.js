import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ajax from "../Services/fetchService";
import {  Button, Card, Col, Container, Row } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import StatusBadge from "../StatusBadge";
import {  useUser } from "../UserProvider";

const CodeReviewerDashboard = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [assignments, setAssignments] = useState(null);

  useEffect(()=>{
    if(!user.jwt)navigate("/login");
  })

  function editReview(assignment){
    window.location.href=`/assignments/${assignment.id}`
  }

  function claimAssignment(assignment) {
    const decodedJWT = jwt_decode(user.jwt);
    const codeReviewer = {
      username: decodedJWT.sub,
    };

    assignment.codeReviewer = codeReviewer;
    //  todo : dont hardcode this status
    assignment.status = "In Review";

    ajax(`/api/assignments/${assignment.id}`, "PUT", user.jwt, assignment).then(
      (updatedAssignment) => {
        const assignmentsCopy = [...assignments];
        const i = assignmentsCopy.findIndex((a) => a.id === assignment.id);
        assignmentsCopy[i] = updatedAssignment;
        setAssignments(assignmentsCopy);
      }
    );
  }

  useEffect(() => {
    ajax("api/assignments", "GET", user.jwt).then((assignmentsData) => {
      setAssignments(assignmentsData);
    });
  }, [user.jwt]);

  function createAssignment() {
    ajax("api/assignments", "POST", user.jwt).then((assignment) => {
     // navigate(`/assignments/${assignment.id}`);
       window.location.href = `/assignments/${assignment.id}`;
    });
  }
  return (
    <Container>
      <Row>
        <Col>
          <div
            className="d-flex justify-content-end"
            style={{ cursor: "pointer" }}
            onClick={() => {
              user.setJwt(null);
              navigate("/login");
            }}
          >
            Logout
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <h1>Code Reviewer Dashboard</h1>
        </Col>
      </Row>
      <div className="assignment-wrapper  in-review">
        <div className="h3 px-2 assignment-wrapper-title">In Review</div>
        {assignments &&
        assignments.filter((assignment) => assignment.status === "In Review")
          .length > 0 ? (
          <div
            className="d-grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fill,18rem)" }}
          >
            {assignments
              .filter((assignment) => assignment.status === "In Review" || assignment.status === "Resubmitted")
              .map((assignment) => (
                <Card
                  key={assignment.id}
                  style={{ width: "18rem", height: "18rem" }}
                >
                  <Card.Body className="d-flex flex-column justify-content-around">
                    <Card.Title>Assignment #{assignment.number}</Card.Title>
                    <div className="d-flex alignitems-start">
                    <StatusBadge text={assignment.status}/>
                    </div>

                    <Card.Text style={{ marginTop: "1em" }}>
                      <b>Github URL:</b> {assignment.githuburl}
                      <br />
                      <b>Branch:</b> {assignment.branch}
                    </Card.Text>

                    <Button
                      variant="secondary"
                      onClick={() => {
                        editReview(assignment);
                      }}
                    >
                      Edit
                    </Button>
                  </Card.Body>
                </Card>
              ))}
          </div>
        ) : (
          <div>No assignments found</div>
        )}
      </div>

      <div className="assignment-wrapper  submitted">
        <div className="h3 px-2 assignment-wrapper-title">Awaiting Review</div>
        {assignments &&
        assignments.filter((assignment) => assignment.status === "Submitted" || assignment.status === "Resubmitted")
          .length > 0 ? (
          <div
            className="d-grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fill,18rem)" }}
          >
            {assignments
              .filter((assignment) => assignment.status === "Submitted" || assignment.status === "Resubmitted")
              .sort((a,b)=> {
                if(a.status === "Resubmitted") return -1;
                else return 1;
              })
              .map((assignment) => (
                <Card
                  key={assignment.id}
                  style={{ width: "18rem", height: "18rem" }}
                >
                  <Card.Body className="d-flex flex-column justify-content-around">
                    <Card.Title>Assignment #{assignment.number}</Card.Title>
                    <div className="d-flex alignitems-start">
                    <StatusBadge text={assignment.status}/>
                    </div>

                    <Card.Text style={{ marginTop: "1em" }}>
                      <b>Github URL:</b> {assignment.githuburl}
                      <br />
                      <b>Branch:</b> {assignment.branch}
                    </Card.Text>

                    <Button
                      variant="secondary"
                      onClick={() => {
                        claimAssignment(assignment);
                      }}
                    >
                      Claim
                    </Button>
                  </Card.Body>
                </Card>
              ))}
          </div>
        ) : (
          <div>No assignments found</div>
        )}
      </div>

      <div className="assignment-wrapper  needs-update">
        <div className="h3 px-2 assignment-wrapper-title">Needs Update</div>
        {assignments &&
        assignments.filter((assignment) => assignment.status === "Needs Update")
          .length > 0 ? (
          <div
            className="d-grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fill,18rem)" }}
          >
            {assignments
              .filter((assignment) => assignment.status === "Needs Update")
              .map((assignment) => (
                <Card
                  key={assignment.id}
                  style={{ width: "18rem", height: "18rem" }}
                >
                  <Card.Body className="d-flex flex-column justify-content-around">
                    <Card.Title>Assignment #{assignment.number}</Card.Title>
                    <div className="d-flex alignitems-start">
                    <StatusBadge text={assignment.status}/>
                    </div>

                    <Card.Text style={{ marginTop: "1em" }}>
                      <b>Github URL:</b> {assignment.githuburl}
                      <br />
                      <b>Branch:</b> {assignment.branch}
                    </Card.Text>

                    <Button
                      variant="secondary"
                      onClick={() => {
                        window.location.href=`/assignments/${assignment.id}`;
                      }}
                    >
                      View
                    </Button>
                  </Card.Body>
                </Card>
              ))}
          </div>
        ) : (
          <div>No assignments found</div>
        )}
      </div>
    </Container>
  );
};

export default CodeReviewerDashboard;
