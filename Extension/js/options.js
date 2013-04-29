function save_options() {
	var server = document.getElementById("server");
	localStorage["server"] = server.value;
	var project = document.getElementById("project");
	localStorage["project"] = project.value;

	// Update status text
	var status = document.getElementById("status");
	status.innerHTML = "Options saved.";
	setTimeout(function() {
		status.innerHTML = "";
	}, 750);
}

function restore_options() {
	var serverURI = localStorage["server"];
	if (!serverURI)
	{
		serverURI = "";
	}
	var projectName = localStorage["project"];
	if (!projectName)
	{
		projectName = "";
	}

	var server = document.getElementById("server");
	var project = document.getElementById("project");

	server.value = serverURI;
	project.value = projectName;

}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);