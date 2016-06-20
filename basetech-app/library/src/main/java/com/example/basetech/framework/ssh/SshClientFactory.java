package com.example.basetech.framework.ssh;

import java.io.IOException;

import net.schmizz.sshj.DefaultConfig;
import net.schmizz.sshj.SSHClient;
import net.schmizz.sshj.transport.TransportException;
import net.schmizz.sshj.transport.verification.PromiscuousVerifier;
import net.schmizz.sshj.userauth.UserAuthException;

public class SshClientFactory {

	private final static DefaultConfig config = new DefaultConfig();

	public static SSHClient initSshClient(String host, String username,
			String password) {
		SSHClient sshClient = new SSHClient(config);
		sshClient.addHostKeyVerifier(new PromiscuousVerifier());
		try {
			sshClient.setConnectTimeout(3 * 1000);
			sshClient.setTimeout(10 * 60 * 1000);
			sshClient.connect(host);
		} catch (IOException e) {
		}

		if (password == null || password.length() == 0) {
			try {
				sshClient.authPublickey(username);
			} catch (UserAuthException e) {
				try {
					sshClient.close();
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					throw new RuntimeException(e1);
				}
				throw new RuntimeException(e);
			} catch (TransportException e) {
				try {
					sshClient.close();
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					throw new RuntimeException(e1);
				}
				throw new RuntimeException(e);
			}
		} else {
			try {
				sshClient.authPassword(username, password);
			} catch (UserAuthException e) {
				try {
					sshClient.close();
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					throw new RuntimeException(e1);
				}
				throw new RuntimeException(e);
			} catch (TransportException e) {
				try {
					sshClient.close();
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					throw new RuntimeException(e1);
				}
				throw new RuntimeException(e);
			}
		}

		return sshClient;
	}
}
