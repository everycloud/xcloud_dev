package com.example.basetech.framework.ssh.domain;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import net.schmizz.sshj.SSHClient;
import net.schmizz.sshj.connection.channel.direct.Session;
import net.schmizz.sshj.connection.channel.direct.Session.Command;

import org.apache.commons.io.output.ByteArrayOutputStream;

import com.example.basetech.framework.ssh.SshClientFactory;
import com.example.basetech.framework.util.StackTraceUtil;

public class SshTask implements Runnable, CmdTask {

	private Long taskId;

	private String targetHost;
	private String username;
	private String password;

	private List<String> cmds;

	private TaskResult result;

	public SshTask() {
		this.result = new TaskResult();
	}

	@Override
	public void run() {
		SSHClient client = null;
		try {
			client = SshClientFactory.initSshClient(targetHost, username,
					password);

			if (null != cmds) {
				result.setStatus(TaskStatus.DOING);
				StringBuilder sb = new StringBuilder();
				for (String cmd : cmds) {
					sb.append(cmd).append(" && ");
				}
				sb.delete(sb.lastIndexOf(" && "), sb.length());
				Session session = client.startSession();
				Command command = session.exec(sb.toString());
				while (command.getExitStatus() == null) {
					try {
						Thread.sleep(1000);
					} catch (Exception ex) {
					}
				}
				int ret = command.getExitStatus();
				System.out.println(ret);
				if (ret == 0) {
					result.setStatus(TaskStatus.DONE);
				} else {
					result.setStatus(TaskStatus.ERROR);
					String err = this.deserializeStream(command
							.getErrorStream());
					result.setError(err);
					System.out.println(err);
				}

			} else {
				result.setStatus(TaskStatus.DONE);
			}
		} catch (Exception ex) {
			result.setStatus(TaskStatus.ERROR);
			result.setError(StackTraceUtil.getStackTrace(ex));
			System.out.println(ex);
		} finally {
			try {
				client.close();
			} catch (Exception ex) {

			}
		}

	}

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}

	public String getTargetHost() {
		return targetHost;
	}

	public void setTargetHost(String targetHost) {
		this.targetHost = targetHost;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public List<String> getCmds() {
		return cmds;
	}

	public void setCmds(List<String> cmds) {
		this.cmds = cmds;
	}

	private String deserializeStream(InputStream stream) throws IOException {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		int i = -1;
		while ((i = stream.read()) != -1) {
			baos.write(i);
		}
		String content = baos.toString();
		baos.close();
		return content;
	}

	public TaskResult getResult() {
		return result;
	}

	public void setResult(TaskResult result) {
		this.result = result;
	}

	@Override
	public TaskStatus getStatus() {
		return this.getResult().getStatus();
	}

	@Override
	public String getError() {
		return this.getResult().getError();
	}
}
